import slugify from "slugify";

const get_slug = (str:string):string=>{
    return slugify(str, {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        strict: false,
        locale: 'vi',
        trim: true
    });
}

export default get_slug;