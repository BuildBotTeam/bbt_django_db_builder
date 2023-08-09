import {ClassFieldTypes, DjangoClassType, DjangoFieldType} from "../models/IDjangoModels";
import FileSaver from "file-saver";
import JSZip from "jszip";

export default function projectBuilder(dClassList: DjangoClassType[], dFieldList: DjangoFieldType[]) {
    const models = new Blob([modelsBuilder(dClassList, dFieldList)], {type: 'text/plain'})
    const admin = new Blob([adminBuilder(dClassList)], {type: 'text/plain'})
    const serializer = new Blob([serializerBuilder(dClassList, dFieldList)], {type: 'text/plain'})
    const views = new Blob([viewSetBuilder(dClassList)], {type: 'text/plain'})
    const urls = new Blob([urlsBuilder(dClassList)], {type: 'text/plain'})

    // console.log(modelsBuilder(dClassList, dFieldList))
    // console.log(adminBuilder(dClassList))
    // console.log(serializerBuilder(dClassList, dFieldList))
    // console.log(viewSetBuilder(dClassList))
    // console.log(urlsBuilder(dClassList))

    const zip = new JSZip();
    zip!.file('models.py', models)
    zip!.file('admin.py', admin)
    zip!.file('serializer.py', serializer)
    zip!.file('views.py', views)
    zip!.file('urls.py', urls)
    zip.generateAsync({type: "blob"}).then(function (content) {
        FileSaver.saveAs(content, "example.zip");
    });
}

export function modelsBuilder(dClassList: DjangoClassType[], dFieldList: DjangoFieldType[]): string {
    const head = 'from django.db import models\n'

    const classFooter = '\n\n    def __str__(self):\n' +
        '        return self.pk'

    const body = dClassList.reduce((prev, {class_name, meta}) => {
        prev += `\n\n\nclass ${class_name}(models.Model):`
        // class Meta:              add later
        //     oredering = '-pk'\n`
        prev += dFieldList.reduce((prev, cur) => {
            if (class_name === cur.parent_class_name && cur.type !== 'key') {
                const props = getFieldPropsByType(cur)
                const field = `\n    ${cur.field_name} = models.${cur.type}(${props.join(', ')})`
                return prev + field
            }
            return prev
        }, '')
        return prev + classFooter
    }, '')

    return head + body
}

export function getFieldPropsByType(field: DjangoFieldType): string[] {
    return ClassFieldTypes[field.type].map<string>(val => getFieldString(val.name, field[val.name], val.type)).filter(v => v)
}

export function getFieldString(name: string, val: any, type: string): string {
    if (!val) return ''
    if (['string', 'late'].includes(type)) return `${name}='${val}'`
    if (name === 'on_delete') return `${name}=models.${val}`
    if (type === 'bool') return `${name}=True`
    return `${name}=${val}`
}

export function adminBuilder(dClassList: DjangoClassType[]) {
    const head = `from django.contrib import admin
from .models import *\n\n`

    const body = dClassList.reduce((prev, cur) => {
        return prev + `\nadmin.site.register(${cur.class_name})`
    }, '')
    return head + body + '\n'
}

export function serializerBuilder(dClassList: DjangoClassType[], dFieldList: DjangoFieldType[]) {
    const head = `from rest_framework import serializers
from .models import *`

    const body = dClassList.reduce((prev, cur) => {
        return prev + `\n\n\nclass ${cur.class_name}Serializer(serializers.ModelSerializer):
    class Meta:
        model = ${cur.class_name}
        fields = (${dFieldList.map((field) => {
            if (cur.class_name === field.parent_class_name && field.type !== 'key') {
                return `'${field.field_name}'`
            }
            return null
        }).filter(v => v).join(', ')},)`
    }, '')
    return head + body + '\n'
}

export function viewSetBuilder(dClassList: DjangoClassType[]) {
    const head = `from rest_framework import viewsets
from .models import *
from .serializers import *`

    const body = dClassList.reduce((prev, cur) => {
        return prev + `\n\n\nclass ${cur.class_name}ViewSet(viewsets.ModelViewSet):
    queryset = ${cur.class_name}.objects.all()
    serializer_class = ${cur.class_name}Serializer`
    }, '')
    return head + body + '\n'
}


export function urlsBuilder(dClassList: DjangoClassType[]) {
    const head = `from rest_framework import routers
from . import views

router = routers.DefaultRouter()\n`
    const body = dClassList.reduce((prev, cur) => {
        const name = cur.class_name.split(/(?=[A-Z])/).map(v => v.toLowerCase()).join('-')
        return prev + `\nrouter.register('${name}', views.${cur.class_name}ViewSet, '${name}')`
    }, '')
    return head + body + '\n'
}