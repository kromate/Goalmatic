export default {
    modelValue: { type: String, default: '' },
    format: {
        type: String,
        required: false,
        default: 'YYYY-MM-DD'
    },
    placeholder: {
        type: String,
        required: false,
        default: 'Select Date'
    },
    type: {
        type: String,
        required: false,
        default: 'date'
    },
    valueType: {
        type: String,
        required: false,
        default: 'format'
    },
    range: {
        type: Boolean,
        required: false,
        default: false
    },
    disabledDate: {
        type: Function,
        required: false,
        default: (date) => date < new Date().setHours(0, 0, 0, 0)
    },
    value: {
        type: Date || String,
        required: false,
        default: new Date()
    },
    editable: {
        type: Boolean,
        required: false,
        default: false
    },
    clearable: {
        type: Boolean,
        required: false,
        default: false
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },
    showHour: {
        type: Boolean,
        required: false,
        default: false
    },
    showMinute: {
        type: Boolean,
        required: false,
        default: false
    },
    showSecond: {
        type: Boolean,
        required: false,
        default: false
    },
    hourStep: {
        type: String,
        required: false,
        default: '1'
    },
    minuteStep: {
        type: String,
        required: false,
        default: '1'
    },
    secondStep: {
        type: String,
        required: false,
        default: '1'
    },
    timePickerOptions: {
        type: Object,
        required: false,
        default: {}
    },
    showTimePanel: {
        type: Boolean,
        required: false,
        default: true
    },
    showToday: {
        type: Boolean,
        required: false,
        default: true
    }
}
