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

<style lang="scss" src="roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss"></style>

<style lang="scss">
    @import '~reset-css';

    $font-color: #000;
    $link-color: #e5a93b;
    $highlight-link-color: #e38c15;

    * {
        box-sizing: border-box;
    }

    a {
        color: $link-color;

        &:hover {
            color: $highlight-link-color;
        }
    }

    body {
        width: 400px;
        font-size: .875rem;
        font-family: 'Roboto', sans-serif;
        padding: .5rem;
        color: $font-color;
        line-height: 1.3;
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

    .button {
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        border-radius: 5px;

        background-color: #44c767;
        border: 1px solid #18ab29;
        display: inline-block;
        cursor: pointer;
        color: #ffffff;
        font-size: .875rem;
        padding: .5rem 1rem;
        text-decoration: none;
        text-shadow: 0 1px 0 #2f6627;

        &:hover {
            background-color: #5cbf2a;
        }

        &:active {
            position: relative;
            top: 1px;
        }

        &:focus {
            outline: 0 !important;
        }
    }
</style>
