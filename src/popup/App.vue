<template>
    <div id="app">
        <div class="app-nav">
            <popup-router-link tag="a" to="settings">
                <i class="fa fa-cog"></i>
            </popup-router-link>
        </div>
        <div class="app-view">
            <router-view/>
        </div>
    </div>
</template>

<script>
    import PopupRouterLink from "./components/PopupRouterLink";

    export default {
        name: "App",
        components: {
            "popup-router-link": PopupRouterLink
        }
    };
</script>

<style lang="scss">
    @import 'reset-css';

    body {
        width: 400px;
        font-size: .875rem;
        font-family: sans-serif;
        padding: .5rem;
    }

    .app-nav {
        display: flex;
        flex-direction: row-reverse;

        a.popup-router-link {
            cursor: pointer;

            i {
                color: #000000 !important;
                font-size: 1.125rem;
            }
        }
    }

    .app-view {
        padding-top: .5rem;
    }
</style>
