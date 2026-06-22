//mohomin123
import * as ort from "onnxruntime-react-native";
import * as FileSystem from "expo-file-system";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as tf from "@tensorflow/tfjs";
import { Asset } from 'expo-asset';
import ImageResizer from 'react-native-image-resizer';
// import {intersection} from 'rectangle-overlap';
import { ActivityIndicator, View, useWindowDimensions } from "react-native";

const OnnxModelPath = "./assets/onnxmodel/fish_yolov5s_320.onnx"
const ImagePath = "./assets/sample_imgs/yellowfin-tuna.jpg";
const OutPath = "./assets/sample_imgs/out.jpg";

async function ortTest() {
    //mohomin123
    const names = [
      "blue-swimmer-crab",
      "grouper",
      "skipjack",
      "yellowfin-tuna",
      "zMarker",
    ];

    console.log("test by mohomin123");

    const window = useWindowDimensions();
    const imageWidth = window.width;

    tf.setBackend('cpu');

    const inputTensor = tf.zeros([640, 640, 3]);
    // resize
    const resizedTensor = tf.image.resizeBilinear(inputTensor, [640, 640]).div(255.0).expandDims(0);
    const create_option = createMySessionOptions();
    const assets = await Asset.loadAsync(require(OnnxModelPath));
    const modelUri = assets[0].localUri;
    const session = await ort.InferenceSession.create(modelUri, create_option);



    const image_assets = await Asset.loadAsync(require(ImagePath));
    const imageUri = image_assets[0].localUri;

    
    const manipResult = await ImageResizer.createResizedImage(imageUri, 
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
    const result = post_process(pred.Output.data);

    console.log("result", result);

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
        console.log("after nms", selected);
        let width = 0;
        let height = 0;
        let e_zMarker_width = 0; //estimated
        let e_zMarker_height = 0;
        const pixel_cm_ratio = 2.54 / 96.0;
        const zMarker_width = 12.7; //cm
        const zMarker_height = 12.7; //cm
        const cm_inch_ratio = 0.393701;
        let resize_factor = {
            'width':1.0, 
            'height':1.0
        }; 
    
        let klass_list = [];
        let detected_boxes = []
        let detected_klass = "";
        for (let iix = 0; iix < selected.length; iix++){
          const [score, bbox, i] = selected[iix];
          const conf_list = confs[i];
          var name_idx = conf_list.reduce((iMax, x, ix, arr) => x > arr[iMax] ? ix : iMax, 0); //argmax
    
          let [x1, y1, x2, y2] = bbox;
          console.log("screenImageWidth(px)", imageWidth);
        //   x1 *= imageWidth;
        //   x2 *= imageWidth;
        //   y1 *= imageWidth;
        //   y2 *= imageWidth;
          width = x2 - x1;
          height = y2 - y1;
    
          const klass = names[name_idx];
    
          if (klass === "zMarker") {
            e_zMarker_width = width * pixel_cm_ratio;
            e_zMarker_height = height * pixel_cm_ratio;
            
            console.log("estimated zMarker_height(cm)", e_zMarker_height);
            console.log("real zMarker_height(cm)", zMarker_height);
            resize_factor.height = zMarker_height / e_zMarker_height;
            resize_factor.width = zMarker_width / e_zMarker_width;
            console.log("height ratio factor", resize_factor.height);
          }
          else{
            detected_boxes.push([
                x1, 
                y1, 
                width,
                height
            ])
            console.log("xyxy", x1, y1, x2, y2);
            console.log("tlxywh", x1, y1, width, height);
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
          const cm_height = pixel_cm_ratio * resize_factor.height * object_height;
          console.log("object_height(cm)", cm_height);

          if (object_name === "grouper") {
            weight_grouper = 0.008 * (cm_height) ** 3.24;
            weight_total += weight_grouper;
          } else if (object_name === "skipjack") {
            weight_skipjack = 2.7593 * (cm_height) ** 1.4437;
            weight_total += weight_skipjack;
          } else if (object_name === "yellowfin-tuna") {
            weight_yellowfin = 0.0096 * (cm_height) ** 2.548;
            weight_total += weight_yellowfin;
          } else if (object_name === "blue-swimmer-crab") {
            weight_crab = 0.0393 * (cm_height) ** 3.222;
            weight_total += weight_crab;
          }
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

  }

  export default ortTest;