import { mapState } from 'vuex';
export const refreshMenuItem = {
    computed: {
        ...mapState({
            isSameMenu(state) {
                return state.isSameMenu;
            }
        })
    }
};
