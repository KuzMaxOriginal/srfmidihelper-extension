<template>
    <component :is="tag" class="popup-router-link" @click="pushRoute">
        <slot></slot>
    </component>
</template>

<script>
    import constants from "../constants";

    export default {
        name: "popup-router-link",
        props: ["tag", "to"],
        methods: {
            pushRoute: function () {
                this.$store.dispatch(constants.PUSH_ROUTE, this.to);
            }
        }
    };
</script>