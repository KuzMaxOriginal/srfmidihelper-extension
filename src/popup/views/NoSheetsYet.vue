<template>
    <div id="noSheetsYet">
        <message-screen>
            To start playing, please open
            <a href="https://www.sightreadingfactory.com/app">https://www.sightreadingfactory.com/app</a>
            and generate new sheet music.
        </message-screen>
    </div>
</template>

<script>
    import MessageScreen from "../components/MessageScreen";

    export default {
        name: "loading",
        components: {
            MessageScreen
        }
    };
</script>