<template>
    <div class="logo">
        <transition name="logoFade">
            <div v-if="collapse" key="collapse" class="sidebar-logo-link">
                <img v-if="logoUrl" :src="logoUrl" class="sidebar-logo" />
                <h1 v-else class="sidebar-title">{{ logoTitle }}</h1>
            </div>
            <div v-else key="expand" class="sidebar-logo-link">
                <img v-if="logoUrl" :src="logoUrl" class="sidebar-logo" />
                <h1 class="sidebar-title">{{ logoTitle }}</h1>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    name: 'logo',
    props: {
        collapse: {
            type: Boolean,
            required: true
        },
        logoUrl: {
            type: String,
            required: true
        },
        logoTitle: {
            type: String,
            required: true
        }
    },
    data() {
        return {};
    },
    methods: {}
};
</script>
<style lang="scss" scoped>
.logoFade-enter-active {
    transition: opacity 1.5s;
}

.logoFade-enter,
.logoFade-leave-to {
    opacity: 0;
}

.logo {
    height: 70px;
    line-height: 70px;
    text-align: left;
    text-indent: 26px;
    white-space: nowrap;
    overflow: hidden;
    // background-color: #001529;
    background-color: #e9edf1;
    & .sidebar-logo-link {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        & .sidebar-logo {
            width: 50px;
            height: 50px;
            border-radius: 4px;
            overflow: hidden;
        }
        & .sidebar-title {
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #333;
            font-weight: 600;
            padding: 0;
            text-align: center;
            font-size: 14px;
            font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        }
    }

    &.collapse {
        .sidebar-logo {
            margin-right: 0px;
        }
    }
}
</style>