<script>
import { sessionStore, localStore } from '@/utils';
import { findIndex } from 'lodash';
import store from '@/store.js';
export default {
    functional: true,
    props: {
        authrity: {
            type: String,
            required: true
        }
    },
    render(h, context) {
        const { props, children } = context;
        let index = findIndex(localStore.get('permissionData'), (o) => {
            return o.id === props.authrity;
        });
        return index >= 0 ? children[0] : null;
    }
};
</script>