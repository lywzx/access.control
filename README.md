# 介绍

`access.control`是基于传统的 RBAC(RoleTypes base Access Control)的权限验证库，同时也主要侧重于权限的验证功能。由于是最纯粹的验证逻辑，所以与平台无关，适用于 NodeJs 及 Browser 端。

[![Build Status](https://img.shields.io/travis/lywzx/access.control/master.svg)](https://travis-ci.org/lywzx/access.control)
[![codecov](https://codecov.io/gh/lywzx/access.control/branch/master/graph/badge.svg)](https://codecov.io/gh/lywzx/access.control)
[![NPM version](https://img.shields.io/npm/v/@lywzx/access.control.svg?style=flat-square)](https://www.npmjs.com/package/@lywzx/access.control)
[![NPM downloads](https://img.shields.io/npm/dm/@lywzx/access.control.svg?style=flat-square)](https://www.npmjs.com/package/@lywzx/access.control)
[![Known Vulnerabilities](https://snyk.io/test/github/lywzx/access.control/badge.svg?targetFile=package.json)](https://snyk.io/test/github/lywzx/access.control?targetFile=package.json)
[![License](https://img.shields.io/npm/l/@lywzx/access.control.svg?sanitize=true)](https://www.npmjs.com/package/@lywzx/access.control)
[![Dependency Status](https://david-dm.org/lywzx/access.control.svg)](https://david-dm.org/lywzx/access.control)
[![devDependencies Status](https://david-dm.org/lywzx/access.control/dev-status.svg)](https://david-dm.org/lywzx/access.control?type=dev)

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
user.hasRole('Assessor'); // will return false;
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

当然也可以验证多组权限，当需要同时具有两组权限时，可以给第二个参数传 true;

    user.can(['add_post', 'remove_user']); // will return true
    user.can(['add_post', 'remove_user'], true);  // will return true;

有时，例如文件只能是自己创建的才能编辑，你可以使用`owns`方法。但使用前，你必须给`user`设置一个用户 ID。

    user.owns({id: 1, title: '新闻标题', user_id: 1});
