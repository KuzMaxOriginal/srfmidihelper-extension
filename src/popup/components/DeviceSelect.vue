<template>
    <div id="deviceSelect">
        <v-select class="select-devices"
                  :options="$store.state.deviceList"
                  :value="$store.state.deviceSelected"
                  placeholder="-- Select device --"
                  @input="setDeviceSelected">
        </v-select>
        <button class="button button-refresh" @click="updateDeviceList">
            <i class="fa fa-refresh" aria-hidden="true"></i>
        </button>
        <button class="button button-select" @click="selectDevice">Select device</button>
    </div>
</template>

<script>
    import constants from "../constants.js";
    import {mapState} from 'vuex';

    import vSelect from 'vue-select';

    export default {
        name: "device-select",
        components: {
            'v-select': vSelect
        },
        computed: mapState({
            deviceList: state => state.deviceList
        }),
        methods: {
            setDeviceSelected(deviceSelected) {
                this.$store.commit(constants.SET_DEVICE_SELECTED, deviceSelected);
            },
            updateDeviceList() {
                this.$store.dispatch(constants.UPDATE_DEVICE_LIST);
            },
            selectDevice() {
                this.$store.dispatch(constants.SELECT_DEVICE);
            }
        }
    };
</script>

<style lang="scss">
    #deviceSelect {
        display: flex;
        flex-wrap: wrap;

        .select-devices {
            flex-grow: 1;
            margin-right: .5rem;

            .dropdown-toggle .clear {
                display: none;
            }
        }

        .button-select {
            flex-basis: 100%;
            margin-top: .5rem;
        }
    }

    .v-select {
        .dropdown-toggle {
            height: 34px;
        }
    }
</style>
