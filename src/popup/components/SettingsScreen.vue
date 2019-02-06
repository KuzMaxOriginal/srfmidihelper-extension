<template>
    <div class="settings-root">
        <div class="settings">
            <div class="settings-param">
                <span class="settings-param-name">Switch On</span>
                <div class="settings-param-value">
                    <toggle-button @change="setIsSwitchedOn" :value="isSwitchedOn"/>
                </div>
            </div>
            <div class="settings-param">
                <span class="settings-param-name">Current Note Color</span>
                <div class="settings-param-value settings-param-color">
                    <button class="button settings-param-color-button"
                            :value="noteFillHighlighted"
                            :style="{'background-color': noteFillHighlighted}"
                            @click="displayPickerNoteHighlighted = true"></button>
                    <sketch-picker v-show="displayPickerNoteHighlighted" :disableAlpha="true"
                                   @input="setNoteFillHighlighted" :value="noteFillHighlighted"/>
                </div>
            </div>
            <div class="settings-param">
                <span class="settings-param-name">Wrong Note Color</span>
                <div class="settings-param-value settings-param-color">
                    <button class="button settings-param-color-button"
                            :value="noteFillWrong"
                            :style="{'background-color': noteFillWrong}"
                            @click="displayPickerNoteWrong = true"></button>
                    <sketch-picker v-show="displayPickerNoteWrong" :disableAlpha="true"
                                   @input="setNoteFillWrong" :value="noteFillWrong"/>
                </div>
            </div>
        </div>
        <button class="button back-btn" @click="goBack">
            OK
        </button>
    </div>
</template>

<script>
    import {Sketch as SketchPicker} from 'vue-color';
    import {ToggleButton} from 'vue-js-toggle-button'

    import {storage} from "../../common";
    import constants from "../constants";

    export default {
        name: "settings-screen",
        components: {
            'toggle-button': ToggleButton,
            'sketch-picker': SketchPicker
        },
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                vm.routeFrom = from;
            });
        },
        mounted() {
            document.addEventListener("click", (event) => {
                if (event.target.closest(".vc-sketch, .settings-param-color-button")) {
                    return;
                }

                this.hideColorPickers();
            });


        },
        data() {
            return {
                routeFrom: null,
                isSwitchedOn: this.$store.state.isSwitchedOn,
                noteFillHighlighted: this.$store.state.noteFillHighlighted,
                noteFillWrong: this.$store.state.noteFillWrong,

                displayPickerNoteHighlighted: false,
                displayPickerNoteWrong: false,
            };
        },
        methods: {
            setIsSwitchedOn(input) {
                this.isSwitchedOn = input.value;
                storage.update({isSwitchedOn: this.isSwitchedOn});
            },
            setNoteFillHighlighted(input) {
                this.noteFillHighlighted = input.hex;
                storage.update({noteFillHighlighted: this.noteFillHighlighted});
            },
            setNoteFillWrong(input) {
                this.noteFillWrong = input.hex;
                storage.update({noteFillWrong: this.noteFillWrong});
            },
            hideColorPickers() {
                this.displayPickerNoteHighlighted = false;
                this.displayPickerNoteWrong = false;
            },
            goBack() {
                this.$store.dispatch(constants.PUSH_ROUTE, this.$store.getters.lastRoute);
            }
        }
    };
</script>

<style lang="scss">
    .settings-root {
        padding: .25rem .5rem;

        .settings {
            display: table;
            table-layout: fixed;

            .settings-param {
                display: table-row;

                .settings-param-name {
                    display: table-cell;
                    padding-right: 3rem;
                    padding-bottom: .5rem;
                }

                .settings-param-value {
                    display: table-cell;
                    padding-bottom: .5rem;

                    &.settings-param-color {
                        position: relative;

                        .settings-param-color-button {
                            width: 100%;
                            height: 21px;
                            border: 1px solid #ccc;
                            border-radius: 50px;
                        }

                        .vc-sketch {
                            position: absolute;
                            top: 0;
                            left: 0;
                            z-index: 999;
                        }
                    }
                }
            }
        }

        .back-btn {
            margin-top: 2rem;
        }
    }
</style>
