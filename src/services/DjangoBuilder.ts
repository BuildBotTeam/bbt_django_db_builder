import {ClassFieldTypes, DjangoClassType, DjangoFieldType} from "../models/IDjangoModels";

export function djangoBuilder(dClassList: DjangoClassType[], dFieldList: DjangoFieldType[]): string {
    const head = 'from django.db import models\n'

    const body = dClassList.reduce((prev, {class_name, meta}) => {
        prev += `
class ${class_name}(models.Model):
    class Meta:
        oredering = '-pk'\n`
        prev += dFieldList.reduce((prev, cur) => {
            const props = ClassFieldTypes[cur.type].map<string>((val, i) => getFieldString(val.name, cur[val.name], i)).filter(v => v)
            const field = `\n    ${cur.field_name} = models.${cur.type}(${props})`
            return prev + field
        }, '')
        return prev
    }, '')

    return head + body
}

function getFieldString(name:string, val: any, index: number): string {
    return val ? index === 0 ? `${name}=${val}` : `, ${name}=${val}` : ''
}


// export function genCharField(dField: DjangoFieldType): string {
//     const {field_name, max_length} = dField
//     const verbose_name = dField.verbose_name ? `, verbose_name=${dField.verbose_name}` : ''
//     const tdefault = dField.tdefault ? `, default=${dField.tdefault}` : ''
//     const blank = dField.blank ? `, blank=True` : ''
//     const tnull = dField.tnull ? `, default=True` : ''
//     return `\n    ${field_name} = models.CharField(max_length=${max_length}${verbose_name}${tdefault}${blank}${tnull})`
// }
//
// export function genTextField(dField: DjangoFieldType): string {
//     const {field_name} = dField
//     const max_length = dField.max_length ? `max_length=${dField.max_length}` : ''
//     const verbose_name = dField.verbose_name ? `, verbose_name=${dField.verbose_name}` : ''
//     const tdefault = dField.tdefault ? `, default=${dField.tdefault}` : ''
//     const blank = dField.blank ? `, blank=True` : ''
//     const tnull = dField.tnull ? `, default=True` : ''
//     return `\n    ${field_name} = models.TextField(${max_length}${verbose_name}${tdefault}${blank}${tnull})`
// }
//
// export function genIntegerField(dField: DjangoFieldType): string {
//     const {field_name} = dField
//     const tdefault = dField.tdefault ? `default=${dField.tdefault}` : ''
//     const verbose_name = dField.verbose_name ? `, verbose_name=${dField.verbose_name}` : ''
//     const blank = dField.blank ? `, blank=True` : ''
//     const tnull = dField.tnull ? `, default=True` : ''
//     return `\n    ${field_name} = models.IntegerField(${tdefault}${verbose_name}${blank}${tnull})`
// }
//
// export function genFloatField(dField: DjangoFieldType): string {
//     const {field_name} = dField
//     const tdefault = dField.tdefault ? `default=${dField.tdefault}` : ''
//     const verbose_name = dField.verbose_name ? `, verbose_name=${dField.verbose_name}` : ''
//     const blank = dField.blank ? `, blank=True` : ''
//     const tnull = dField.tnull ? `, default=True` : ''
//     return `\n    ${field_name} = models.FloatField(${tdefault}${verbose_name}${blank}${tnull})`
// }
//
// export function genForeignKey(dField: DjangoFieldType): string {
//     const {field_name, class_name, on_delete} = dField
//     const verbose_name = dField.verbose_name ? `, verbose_name=${dField.verbose_name}` : ''
//     const blank = dField.blank ? `, blank=True` : ''
//     const tnull = dField.tnull ? `, default=True` : ''
//     return `\n    ${field_name} = models.ForeignKey('${class_name}', on_delete=models.${on_delete}${verbose_name}${blank}${tnull})`
// }
//
// export function genManyToManyField(dField: DjangoFieldType): string {
//     const {field_name, class_name} = dField
//     const verbose_name = dField.verbose_name ? `, verbose_name=${dField.verbose_name}` : ''
//     const blank = dField.blank ? `, blank=True` : ''
//     const tnull = dField.tnull ? `, default=True` : ''
//     return `\n    ${field_name} = models.ManyToManyField('${class_name}'${verbose_name}${blank}${tnull})`
// }


