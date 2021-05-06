import  { flattenDeep }  from 'lodash';

const doPermission = (permissionMenu) => {
    let permissionObj = [];
    permissionMenu.forEach((element) => {
        let children = element.children;
        if (children && children.length) {
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                permissionObj.push(child.children);
            }
        }
    });
    return flattenDeep(permissionObj);
};
export default doPermission;
