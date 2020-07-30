let BaseURL = 'https://larria.github.io/magiccard/assets'
let avatarsURLList = (new Array(18)).fill(1).map((item, index) => {
    return `${BaseURL}/other/avatar/avatar${index + 1}.svg`
})

export {
    avatarsURLList
}