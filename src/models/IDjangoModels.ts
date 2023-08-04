export type Point = {
    x: number
    y: number
    width: number
    height: number
}

export type ConnectionItem = {
    class_name: string
    field_name: string
    pos: Point
    dif_y: number
}

export type ConnectionType = {
    id: string
    from: ConnectionItem
    to: ConnectionItem
}

export type DjangoClassType = {
    class_name: string
    pos: Point
    meta?: ClassMetaType
    color: string
}

export const ClassFieldTypes = {
    CharField: [
        {name: 'max_length', required: true, type: 'string'},
        {name: 'verbose_name', required: false, type: 'string'},
        {name: 'default', required: false, type: 'string'},
        {name: 'blank', required: false, type: 'bool'},
        {name: 'null', required: false, type: 'bool'},
    ],
    TextField: [
        {name: 'max_length', required: false, type: 'string'},
        {name: 'verbose_name', required: false, type: 'string'},
        {name: 'default', required: false, type: 'string'},
        {name: 'blank', required: false, type: 'bool'},
        {name: 'null', required: false, type: 'bool'},
    ],
    ForeignKey: [
        {name: 'class_name', required: true, type: 'string'},
        {name: 'on_delete', required: true, type: 'select'},
        {name: 'related_name', required: false, type: 'select'},
        {name: 'verbose_name', required: false, type: 'string'},
        {name: 'blank', required: false, type: 'bool'},
        {name: 'null', required: false, type: 'bool'},
    ],
    ManyToManyField: [
        {name: 'class_name', required: true, type: 'string'},
        {name: 'related_name', required: false, type: 'select'},
        {name: 'verbose_name', required: false, type: 'string'},
        {name: 'null', required: false, type: 'bool'},
    ],
    OneToOneField: [
        {name: 'class_name', required: true, type: 'string'},
        {name: 'on_delete', required: true, type: 'select'},
        {name: 'related_name', required: false, type: 'select'},
        {name: 'verbose_name', required: false, type: 'string'},
        {name: 'blank', required: false, type: 'bool'},
        {name: 'null', required: false, type: 'bool'},
    ],
    IntegerField: [
        {name: 'default', required: true, type: 'string'},
        {name: 'verbose_name', required: false, type: 'string'},
        {name: 'blank', required: false, type: 'bool'},
        {name: 'null', required: false, type: 'bool'},
    ],
    FloatField: [
        {name: 'default', required: true, type: 'string'},
        {name: 'verbose_name', required: false, type: 'string'},
        {name: 'blank', required: false, type: 'bool'},
        {name: 'null', required: false, type: 'bool'},
    ],
    // FileField: [
    //     {name: 'max_length', required: false, type: 'string'},
    //     {name: 'verbose_name', required: false, type: 'string'},
    //     {name: 'default', required: false, type: 'string'},
    //     {name: 'blank', required: false, type: 'bool'},
    //     {name: 'null', required: false, type: 'bool'},
    //     {name: 'class_name', required: false, type: 'string'},
    //     {name: 'on_delete', required: false, type: 'select'},
    //     {name: 'related_name', required: false, type: 'select'},
    // ],
    // DateTimeField: [
    //     {name: 'max_length', required: false, type: 'string'},
    //     {name: 'verbose_name', required: false, type: 'string'},
    //     {name: 'default', required: false, type: 'string'},
    //     {name: 'blank', required: false, type: 'bool'},
    //     {name: 'null', required: false, type: 'bool'},
    //     {name: 'class_name', required: false, type: 'string'},
    //     {name: 'on_delete', required: false, type: 'select'},
    //     {name: 'related_name', required: false, type: 'select'},
    // ],
    // DateField: [
    //     {name: 'max_length', required: false, type: 'string'},
    //     {name: 'verbose_name', required: false, type: 'string'},
    //     {name: 'default', required: false, type: 'string'},
    //     {name: 'blank', required: false, type: 'bool'},
    //     {name: 'null', required: false, type: 'bool'},
    //     {name: 'class_name', required: false, type: 'string'},
    //     {name: 'on_delete', required: false, type: 'select'},
    //     {name: 'related_name', required: false, type: 'select'},
    // ],
    BooleanField: [
        {name: 'default', required: true, type: 'string'},
        {name: 'verbose_name', required: false, type: 'string'},
        {name: 'blank', required: false, type: 'bool'},
        {name: 'null', required: false, type: 'bool'},
    ],
    key: [],
}

export type DjangoFieldType = {
    id?: number
    parent_class_name?: string
    type: keyof typeof ClassFieldTypes
    field_name: string
    related_name?: string
    dif_y?: number
    class_name?: string
    key_id?: number
    field_id?: number
    max_length?: number
    on_delete?: string
    verbose_name?: string
    blank?: boolean
    "null"?: boolean
    default?: string
    [all: string]: any
}

export type ClassMetaType = {
    ordering?: string
}