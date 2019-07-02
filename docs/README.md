# 介绍

`access.control`是基于传统的RBAC(RoleTypes base Access Control)的权限验证库，同时也主要侧重于权限的验证功能。由于是最纯粹的验证逻辑，所以与平台无关，适用于NodeJs及Browser端。

# 快速上手

## 项目中直接安装

    # 安装
    yarn add @lywzx/access.control # 或者：npm install @lywzx/vue.access.control

## 使用示例
    import { User, RoleTypes } from '@lywzx/access.control';

    let user = new User([
            'Administrator',
            'Editor'
        ], [
            'add_post',
            'edit_post',
            'add_user',
            'remove_user'
       ]);



验证用户是否包含某个角色
    
    user.hasRole('Administrator'); // will return true;
    user.hasRole('Assessor');        // will return false;
    user.hasRole(['Administrator', 'Assessor']); // will return true;
    

验证用户是否同时包含多个角色

    user.hasRole(['Administrator', 'Editor'], true);  // will return true
    user.hasRole(['Editor', 'Assessor'], true);       // will return true;    

验证用户是拥有某个权限

    user.can('add_post');     // will return true;
    user.can('remove_post');  // will return false;

验证是否拥有某一类权限，可以使用`*`来代代替

    user.can('*_post');      // will return true;
    user.can('*_comment');   // will return false;

当然也可以验证多组权限，当需要同时具有两组权限时，可以给第二个参数传true;

    user.can(['add_post', 'remove_user']); // will return true
    user.can(['add_post', 'remove_user'], true);  // will return true;

有时，例如文件只能是自己创建的才能编辑，你可以使用`owns`方法。但使用前，你必须给`user`设置一个用户ID。

    user.owns({id: 1, title: '新闻标题', user_id: 1});
    
