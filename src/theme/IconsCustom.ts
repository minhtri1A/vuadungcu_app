import { createIconSetFromFontello } from 'react-native-vector-icons';
import { configIcon } from 'config';

const IconsCustom = createIconSetFromFontello(configIcon);

export type IconsCustomType = typeof IconsCustom;
export default IconsCustom;
