import styled from "styled-components/native";

const defaultTextStyles = (theme) => `
  flex-wrap: wrap;
  margin-top: 0px;
  margin-bottom: 0px;
  color: ${theme.colors.text.primary};
  font-weight: ${theme.fontWeights.regular};
`;

const body = (theme) => `
  font-size: ${theme.fontSizes.body};
`;

const label = (theme) => `
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.body};
  font-weight: ${theme.fontWeights.medium};
`;

const caption = (theme) => `
  font-size: ${theme.fontSizes.caption};
  font-weight: ${theme.fontWeights.bold};
`;

const error = (theme) => `
  color: ${theme.colors.text.error};
`;

const hint = (theme) => `
  font-size: ${theme.fontSizes.body};
`;

const variants = {
  body,
  label,
  caption,
  error,
  hint,
};

const Text = styled.Text`
  ${({ theme }) => defaultTextStyles(theme)}
  ${({ variant, theme }) => variants[variant](theme)}
`;

Text.defaultProps = {
  variant: "body",
};

export default Text;
