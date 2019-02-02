<template>
    <div id="runtimeScreen">
        <span class="message">Now play the notes!</span>
        <div class="buttons">
            <button class="button button-back" @click="selectAnotherDevice">Select another device</button>
            <button class="button button-reset" @click="resetNotes">Reset</button>
        </div>
    </div>
</template>

<script>
    import { storage } from "../../common";

    export default {
        name: "runtime-screen",
        methods: {
            selectAnotherDevice() {
                this.$router.push({name: "select-device"});
            },
            resetNotes() {
                storage.update({currentNoteIndex: 0, wrongNotesCount: 0});
            }
        }
    };
</script>

<style lang="scss">
    #runtimeScreen {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: .5rem;
        flex-direction: column;
        flex-wrap: wrap;

        .buttons {
            display: flex;
            margin-top: .5rem;

            .button {
                flex-grow: 1;
                margin-right: .5rem;

                &:last-of-type {
                    margin-right: 0;
                }
            }
        }
    }
</style>
