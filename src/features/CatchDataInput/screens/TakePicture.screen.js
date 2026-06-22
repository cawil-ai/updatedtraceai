import React, { useState, useEffect, useRef } from "react";
import { ActivityIndicator, View, useWindowDimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Svg, { Text } from "react-native-svg";
import { Camera, Evaluating, SnapButton } from "./TakePicture.styles";
import FillContainer from "../../../components/utility/FillContainer.component";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";
import ImageResizer from 'react-native-image-resizer';

import * as ort from "onnxruntime-react-native";
import { Asset } from 'expo-asset';


// const modelJSON = require("../../../../assets/model_v3/model.json");
// const modelWeights = [
//   require("../../../../assets/model_v3/group1-shard1of7.bin"),
//   require("../../../../assets/model_v3/group1-shard2of7.bin"),
//   require("../../../../assets/model_v3/group1-shard3of7.bin"),
//   require("../../../../assets/model_v3/group1-shard4of7.bin"),
//   require("../../../../assets/model_v3/group1-shard5of7.bin"),
//   require("../../../../assets/model_v3/group1-shard6of7.bin"),
//   require("../../../../assets/model_v3/group1-shard7of7.bin")
// ];
// const modelJSON2 = require("../../../../assets/models_unit_8/model.json");
// const modelWeights2 = [
//   require("../../../../assets/models_unit_8/group1-shard1of1.bin"),
// ];

const OnnxModelPath = "../../../../assets/onnxmodel/fish_yolov5s_320_new.onnx"
const SampleImagePath = "../../../../assets/sample_imgs/yellowfin-tuna.jpg";


//console.log(FishWeights.klass);

const names = [
  "blue-swimmer-crab",
  "grouper",
  "skipjack",
  "yellowfin-tuna",
  "zMarker",
];

const TakePicture = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [session, setSession] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef();

  const [evaluating, setEvaluating] = useState(false);

  //* Get screen dimensions
  //  Useful for styling later
  const window = useWindowDimensions();
  const imageWidth = window.width;
  const imageHeight = window.height;

  //* Request permission to use the camera
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      // await tf.ready();
      tf.setBackend('cpu');
      // const loadedModel = await tf.loadGraphModel(
      //   bundleResourceIO(modelJSON2, modelWeights),
      // );

      const create_option = createMySessionOptions();
      const assets = await Asset.loadAsync(require(OnnxModelPath));
      const modelUri = assets[0].localUri;
      const session = await ort.InferenceSession.create(modelUri, create_option);
      
      setSession(session);
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  async function snap() {
    try {
      // tf.setBackend('cpu');
      if (cameraRef) {
        setEvaluating(true);
        const pic_options = {}
        const image = await cameraRef.current.takePictureAsync(pic_options);
        // const image_assets = await Asset.loadAsync(require(SampleImagePath));
        // const imageUri = image_assets[0].localUri;

        const manipResult = await ImageResizer.createResizedImage(image.uri, 
          320, 320, "JPEG", 100, 0, null, false, {mode: 'stretch'}).then(
            (response) => {
              return response.uri;
              }
        )
    
        const imageB64 = await FileSystem.readAsStringAsync(manipResult, { // manipResult
          encoding: FileSystem.EncodingType.Base64,
        });
    
        const imageBuffer = tf.util.encodeString(imageB64, "base64").buffer;
    
        const imageData = new Uint8Array(imageBuffer);
        const imageTensor = decodeJpeg(imageData);
    
        const tensorA = imageTensor.transpose([2,0,1]); // 3, 320, 320
        const tensorB = tensorA.div(255.0).expandDims(0); // 1, 3, 320, 320, float
        const bufferB = tensorB.dataSync().buffer
        const floatData = new Float32Array(bufferB);
    
        const feeds = {
          Input: new ort.Tensor('float32', floatData, [1, 3, 320, 320])
        };
        
        const run_option = createRunOptions();
        const pred = await session.run(feeds, run_option); // specify options
        const [detected_boxes, detected_klass, weight_total] = post_process(pred.Output.data);

        setEvaluating(false);  // hide evaluating loading screen
        // go to CatchDataInput screen with data
        navigation.navigate("CatchDataInput", {
          imageURI: manipResult,
          detected_boxes: detected_boxes,
          detected_klass: detected_klass,
          totalWeight: parseFloat(weight_total),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  function createMySessionOptions() {
    return { intraOpNumThreads: 1, enableCpuMemArena: false }
  }

  function createRunOptions() {
      return { logSeverityLevel: 0 };
  }

  function convertBlock(buffer) {
    var incomingData = new Uint8Array(buffer); // create a uint8 view on the ArrayBuffer
    var i, l = incomingData.length; // length, we need this for the loop
    var outputData = new Float32Array(incomingData.length); // create the Float32Array for output
    for (i = 0; i < l; i++) {
        outputData[i] = incomingData[i] / 255.0; // convert audio to float
    }
    return outputData; // return the Float32Array
  }

  function post_process(buffer){

    const data = new Float32Array(buffer);
    let boxes = []; 
    let scores = [];
    let confs = [];
    for (let i = 0; i < data.length/10; i++){
      if (data[(i*10)+4] > 0.25){
        //cxywh to xyxy
        boxes.push(xywh2xyxy(data.slice((i*10), (i*10)+4 )));
        scores.push(data[(i*10)+4]);
        confs.push(data.slice((i*10)+5, (i*10)+10 ));
      }
    }
    const selected = nms(scores, boxes);
    let width = 0;
    let height = 0;
    let aruco_perimeter = 0;
    let pixel_cm_ratio = 1.0;
    const true_perimeter = 20; //cm true perimeter of the aruco marker
    
    //const zMarker_width = 12.7; //cm
    //const zMarker_height = 12.7; //cm
    // let resize_factor = {
    //     'width':1.0, 
    //     'height':1.0
    // }; 

    let klass_list = [];
    let detected_boxes = []
    let detected_klass = "";
    for (let iix = 0; iix < selected.length; iix++){
      const [score, bbox, i] = selected[iix];
      const conf_list = confs[i];
      var name_idx = conf_list.reduce((iMax, x, ix, arr) => x > arr[iMax] ? ix : iMax, 0); //argmax

      let [x1, y1, x2, y2] = bbox;
    //   x1 *= imageWidth;
    //   x2 *= imageWidth;
    //   y1 *= imageWidth;
    //   y2 *= imageWidth;

      width = x2 - x1;
      height = y2 - y1;

      const klass = names[name_idx];

      if (klass === "zMarker") {
        aruco_perimeter = 2 * (width + height);
        console.log("This is the perimeter: " + aruco_perimeter);
        pixel_cm_ratio = aruco_perimeter / true_perimeter;
        console.log("This is the pixel_cm_ratio: " + pixel_cm_ratio);
      }
      else{
        detected_boxes.push([
            x1, 
            y1, 
            width,
            height
        ])

        klass_list.push(klass);
        detected_klass = klass;
      }
    }
    let weight_crab = 0;
    let weight_grouper = 0;
    let weight_skipjack = 0;
    let weight_yellowfin = 0;
    let weight_total = 0.0;
    // Loop through the class detected to estimate the weights
    for (let k_idx = 0; k_idx < klass_list.length; k_idx++) {
      const object_name = klass_list[k_idx];
      const [ox, oy, object_width, object_height] = detected_boxes[k_idx];
      const cm_height = parseInt(object_height / pixel_cm_ratio);
      console.log("This is the length of the fish: " + cm_height);
      // computations are based on the excel file...Except for the Crab Weight
        if (object_name === "grouper") {
          weight_grouper = 0.00001 * (cm_height) ** 3.0548;
          weight_total += weight_grouper;
          console.log("grouper weight: " + weight_grouper);
        } else if (object_name === "skipjack") {
          weight_skipjack = 0.000005 * (cm_height) ** 3.3753;
          weight_total += weight_skipjack;
          console.log("grouper weight: " + weight_skipjack);
        } else if (object_name === "yellowfin-tuna") {
          weight_yellowfin = 0.00002 * (cm_height) ** 2.9751;
          weight_total += weight_yellowfin;
          console.log("grouper weight: " + weight_yellowfin);
        } else if (object_name === "blue-swimmer-crab") {
          weight_crab = 0.0393 * (cm_height) ** 3.222;
          weight_total += weight_crab;
          console.log("grouper weight: " + weight_crab);
        }
      
      
      console.log("This is the total weight: " + weight_total)
    }
    if (aruco_perimeter == 0){
      alert("zMark is not detected. please check if there is a zMark. weight estimation is not accurate.")
    }
    return [detected_boxes, detected_klass, weight_total];

  }

function nms(scores, boxes){
  let zipped = []
  for (let i = 0; i < scores.length; i++) {
    zipped.push([
      scores[i], boxes[i], i
    ])
  }

  // sort by score
  const sorted = zipped.sort((a, b) => b[0] - a[0])
  const selected = []
  sorted.forEach(box => {
    let toAdd = true
    for (let i = 0; i < selected.length; i++) {
      const iou = box_iou(box[1], selected[i][1])
      if (iou > 0.45) {
        toAdd = false
      }
    }

    if (toAdd) {
      selected.push(box)
    }
  })

  return selected
}

  function nms(scores, boxes){
    let zipped = []
    for (let i = 0; i < scores.length; i++) {
      zipped.push([
        scores[i], boxes[i], i
      ])
    }

    // sort by score
    const sorted = zipped.sort((a, b) => b[0] - a[0])
    const selected = []
    sorted.forEach(box => {
      let toAdd = true
      for (let i = 0; i < selected.length; i++) {
        const iou = box_iou(box[1], selected[i][1])
        if (iou > 0.45) {
          toAdd = false
        }
      }

      if (toAdd) {
        selected.push(box)
      }
    })

    return selected
  }

  function xywh2xyxy(bbox){
  const [x, y, w, h] = bbox; 
    let new_bbox = [];
    new_bbox.push(x - w / 2);
    new_bbox.push(y - h / 2)
    new_bbox.push(x + w / 2)
    new_bbox.push(y + h / 2)
    return new_bbox;
  }

  function box_iou(bbox1, bbox2){
    const [x11, y11, x12, y12] = bbox1;
    const [x21, y21, x22, y22] = bbox2;

    const x_left = Math.max(x11, x21);
    const y_top = Math.max(y11, y21);
    const x_right = Math.min(x12, x22);
    const y_bottom = Math.min(y12, y22);

    if (x_right < x_left || y_bottom < y_top){
      return 0.0
    }
    
    const intersection_area = (x_right - x_left) * (y_bottom - y_top);
    const bb1_area = (x12 - x11) * (y12 - y11);
    const bb2_area = (x22 - x21) * (y22 - y21);

    const iou = intersection_area / (bb1_area + bb2_area - intersection_area);

    return iou;
  }


  //* Unmount camera component upon leaving the screen
  if (!isFocused) {
    return (
      <View>
        <Text>Camera already in use!</Text>
      </View>
    );
  }

  return (
    <FillContainer>
      <Camera type={type} ref={(camera) => (cameraRef.current = camera)}>
        {evaluating && (
          <Evaluating>
            <ActivityIndicator size="large" color="white" />
            <Svg width={window.width} height={window.height / 3}>
              <Text
                fill="white"
                fontWeight="bold"
                fontSize="30"
                x={window.width / 2}
                y={window.height / 6}
                textAnchor="middle">
                Saving...
              </Text>
            </Svg>
          </Evaluating>
        )}
        <SnapButton onPress={snap} evaluating={evaluating} />
      </Camera>
    </FillContainer>
  );
};

export default TakePicture;
