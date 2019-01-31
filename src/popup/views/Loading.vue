<template>
    <div id="loading">
        <message-screen>Loading...</message-screen>
    </div>
</template>

<script>
    import MessageScreen from "../components/MessageScreen";

    export default {
        name: "loading",
        components: {
            MessageScreen
        },
    };
</script>