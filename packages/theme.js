import { dark as theme } from 'mdx-deck/themes'
import nightOwl from "prism-react-renderer/themes/nightOwl"

export default {
  ...theme,

  colors: {
    ...theme.colors,
    background: '#272425',
  },
  codeSurfer: {
    ...nightOwl,
    showNumbers: false
  }
  // Customize your presentation theme here.
  //
  // Read the docs for more info:
  // https://github.com/jxnblk/mdx-deck/blob/master/docs/theming.md
  // https://github.com/jxnblk/mdx-deck/blob/master/docs/themes.md

}
