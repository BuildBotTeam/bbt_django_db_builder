import {ClassFieldTypes, DjangoClassType, DjangoFieldType} from "../models/IDjangoModels";

export function djangoBuilder(dClassList: DjangoClassType[], dFieldList: DjangoFieldType[]): string {
    const head = 'from django.db import models\n'

    const body = dClassList.reduce((prev, {class_name, meta}) => {
        prev += `
class ${class_name}(models.Model):
    class Meta:
        oredering = '-pk'\n`
        prev += dFieldList.reduce((prev, cur) => {
            if (class_name === cur.class_name) {
                const props = getFieldPropsByType(cur)
                const field = `\n    ${cur.field_name} = models.${cur.type}(${props})`
                return prev + field
            }
            return ''
        }, '')
        return prev
    }, '')

    return head + body
}

export function getFieldPropsByType(field: DjangoFieldType): string[] {
    return ClassFieldTypes[field.type].map<string>(val => getFieldString(val.name, field[val.name])).filter(v => v)
}

export function getFieldString(name: string, val: any): string {
    if (!val) return ''
    if (name === 'class_name') return `${name}='${val}'`
    return `${name}=${val}`
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


