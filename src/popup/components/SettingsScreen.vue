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
                <div class="settings-param-value">
                    <pick-color :value="noteFillHighlighted" @input="setNoteFillHighlighted"/>
                </div>
            </div>
            <div class="settings-param">
                <span class="settings-param-name">Wrong Note Color</span>
                <div class="settings-param-value settings-param-color">
                    <pick-color :value="noteFillWrong" @input="setNoteFillWrong"/>
                </div>
            </div>
        </div>
        <button class="button back-btn" @click="goBack">
            OK
        </button>
    </div>
</template>

<script>
    import {ToggleButton} from 'vue-js-toggle-button'

    import {storage} from "../../common";
    import constants from "../constants";
    import PickColor from "./PickColor";

    export default {
        name: "settings-screen",
        components: {
            'toggle-button': ToggleButton,
            'pick-color': PickColor
        },
        data() {
            return {
                routeFrom: null,
                isSwitchedOn: this.$store.state.isSwitchedOn,
                noteFillHighlighted: this.$store.state.noteFillHighlighted,
                noteFillWrong: this.$store.state.noteFillWrong,
            };
        },
        methods: {
            setIsSwitchedOn(input) {
                this.isSwitchedOn = input.value;
                storage.update({isSwitchedOn: this.isSwitchedOn});
            },
            setNoteFillHighlighted(value) {
                this.noteFillHighlighted = value;
                storage.update({noteFillHighlighted: this.noteFillHighlighted});
            },
            setNoteFillWrong(value) {
                this.noteFillWrong = value;
                storage.update({noteFillWrong: this.noteFillWrong});
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
                }
            }
        }

        .back-btn {
            margin-top: 2rem;
        }
    }
</style>
