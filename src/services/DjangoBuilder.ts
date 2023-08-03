import {DjangoClassType, DjangoFieldType} from "../models/IDjangoModels";

export function djangoBuilder(dClassList: DjangoClassType[], dFieldList: DjangoFieldType[]): string {
    const head = 'from django.db import models\n'

    const body = dClassList.reduce((prev, {class_name, meta}) => {
        prev += `
class ${class_name}(models.Model):
    class Meta:
        oredering = '-pk'\n`
        prev += dFieldList.reduce((prev, cur) => {
            switch (cur.type) {
                case "CharField":
                    return prev + genCharField(cur)
                case "TextField":
                    return prev + genTextField(cur)
                case "IntegerField":
                    return prev + genIntegerField(cur)
                case "FloatField":
                    return prev + genFloatField(cur)

                case "ForeignKey":
                    return prev + genForeignKey(cur)
                case "ManyToManyField":
                    return prev + genManyToManyField(cur)
                // case "OneToOneField":
                //     return prev + genCharField(cur)
                //
                // case "FileField":
                //     return prev + genCharField(cur)
                // case "DateField":
                //     return prev + genCharField(cur)
                // case "DateTimeField":
                //     return prev + genCharField(cur)
                // case "BooleanField":
                //     return prev + genCharField(cur)
                default:
                    return prev
            }
        }, '')
        return prev
    }, '')

    return head + body
}


export function genCharField(dField: DjangoFieldType): string {
    const {field_name, max_length} = dField
    const verbose_name = dField.verbose_name ? `, verbose_name=${dField.verbose_name}` : ''
    const tdefault = dField.tdefault ? `, default=${dField.tdefault}` : ''
    const blank = dField.blank ? `, blank=True` : ''
    const tnull = dField.tnull ? `, default=True` : ''
    return `\n    ${field_name} = models.CharField(max_length=${max_length}${verbose_name}${tdefault}${blank}${tnull})`
}

export function genTextField(dField: DjangoFieldType): string {
    const {field_name} = dField
    const max_length = dField.max_length ? `max_length=${dField.max_length}` : ''
    const verbose_name = dField.verbose_name ? `, verbose_name=${dField.verbose_name}` : ''
    const tdefault = dField.tdefault ? `, default=${dField.tdefault}` : ''
    const blank = dField.blank ? `, blank=True` : ''
    const tnull = dField.tnull ? `, default=True` : ''
    return `\n    ${field_name} = models.TextField(${max_length}${verbose_name}${tdefault}${blank}${tnull})`
}

export function genIntegerField(dField: DjangoFieldType): string {
    const {field_name} = dField
    const tdefault = dField.tdefault ? `default=${dField.tdefault}` : ''
    const verbose_name = dField.verbose_name ? `, verbose_name=${dField.verbose_name}` : ''
    const blank = dField.blank ? `, blank=True` : ''
    const tnull = dField.tnull ? `, default=True` : ''
    return `\n    ${field_name} = models.IntegerField(${tdefault}${verbose_name}${blank}${tnull})`
}

export function genFloatField(dField: DjangoFieldType): string {
    const {field_name} = dField
    const tdefault = dField.tdefault ? `default=${dField.tdefault}` : ''
    const verbose_name = dField.verbose_name ? `, verbose_name=${dField.verbose_name}` : ''
    const blank = dField.blank ? `, blank=True` : ''
    const tnull = dField.tnull ? `, default=True` : ''
    return `\n    ${field_name} = models.FloatField(${tdefault}${verbose_name}${blank}${tnull})`
}

export function genForeignKey(dField: DjangoFieldType): string {
    const {field_name, class_name, on_delete} = dField
    const verbose_name = dField.verbose_name ? `, verbose_name=${dField.verbose_name}` : ''
    const blank = dField.blank ? `, blank=True` : ''
    const tnull = dField.tnull ? `, default=True` : ''
    return `\n    ${field_name} = models.ForeignKey('${class_name}', on_delete=models.${on_delete}${verbose_name}${blank}${tnull})`
}

export function genManyToManyField(dField: DjangoFieldType): string {
    const {field_name, class_name} = dField
    const verbose_name = dField.verbose_name ? `, verbose_name=${dField.verbose_name}` : ''
    const blank = dField.blank ? `, blank=True` : ''
    const tnull = dField.tnull ? `, default=True` : ''
    return `\n    ${field_name} = models.ManyToManyField('${class_name}'${verbose_name}${blank}${tnull})`
}


