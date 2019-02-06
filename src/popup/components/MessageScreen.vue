<template>
    <div class="messageScreen">
        <span><slot></slot></span>
    </div>
</template>

<script>
    export default {
        name: "message-screen",
        mounted: function () {
            this.$slots.default.forEach((slotNode) => {
                slotNode.elm.addEventListener("click", this.onSlotClick)
            });
        },
        beforeDestroy: function () {
            this.$slots.default.forEach((slotNode) => {
                slotNode.elm.removeEventListener("click", this.onSlotClick)
            });
        },
        methods: {
            onSlotClick: function (event) {
                if (event.target.tagName === "A") {
                    event.preventDefault();
                    chrome.tabs.create({
                        url: event.target.getAttribute("href")
                    });
                }
            }
        }
    };
</script>

<style lang="scss">
    .messageScreen {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: .5rem 3rem;
        margin-top: -1.125rem;

        span {
            display: block;
        }
    }
</style>
