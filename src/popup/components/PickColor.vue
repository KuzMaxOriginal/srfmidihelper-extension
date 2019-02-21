<template>
    <div class="pick-color">
        <button class="button pick-color-button"
                :value="valueMutable"
                :style="{'background-color': valueMutable}"
                @click="displayPicker()"></button>
        <sketch-picker v-show="showPicker" :disableAlpha="true"
                       @input="updateValue" :value="valueMutable"/>
    </div>
</template>

<script>
    import {Sketch as SketchPicker} from 'vue-color';

    export default {
        name: "pick-color",
        components: {
            'sketch-picker': SketchPicker
        },
        props: ['value'],
        mounted: function () {
            document.addEventListener("click", (event) => {
                if (event.target.closest(".vc-sketch, .pick-color-button")) {
                    return;
                }

                this.hidePicker();
            });
        },
        data() {
            return {
                valueMutable: this.value,
                showPicker: false
            };
        },
        methods: {
            displayPicker() {
                this.showPicker = true;
            },
            hidePicker() {
                this.showPicker = false;
            },
            updateValue(input) {
                this.valueMutable = input.hex;
                this.$emit("input", this.valueMutable);
            },
        }
    };
</script>

<style lang="scss">
    .pick-color {
        position: relative;

        .pick-color-button {
            width: 100%;
            height: 21px;
            border: 1px solid #ccc;
            border-radius: 50px;
        }

        .vc-sketch { // TODO: move to PickColor.vue
            position: absolute;
            top: 0;
            left: 0;
            z-index: 999;
        }
    }
</style>
