# -*- coding: utf-8 -*-

""" License

    Copyright (C) 2014 YUNOHOST.ORG

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program; if not, see http://www.gnu.org/licenses

"""

""" yunohost_menu.py

    Manage menus
"""
import os
import sys
import crypt
import random
import string
import json
import errno
import MySQLdb

from moulinette.core import MoulinetteError
from yunohost.hook import hook_callback




def menu_list(group=None,info=False):
    """
    List menus

    """
    db,cur = _get_db() 
    if group:
        cur.execute("SELECT `id_node`,`group`,`style`, `title`, `link`, `image` FROM `menu_menu` WHERE `group`=%s",group)
    else:
        cur.execute("SELECT `id_node`,`group`,`style`, `title`, `link`, `image` FROM `menu_menu`")
    result_list=[]
    for row in cur.fetchall() :
        o={
        'id': row['id_node'],
        'group': row['group'],
        'style': row['style']}
        if row['title']:
            o['title']=row['title']
        if row['link']:
            o['link']=row['link']
        if row['image']:
            o['image']=row['image']
        if info:
            o['tree']=_get_tree(cur,row['id_node'])
        result_list.append(o)

    _close_db(db,cur)
    return { 'menus' : result_list }

def menu_create(auth, group='public',style='default', title=None, link='#', image=None):
    """
    Create menu

    Keyword argument:
        group -- public for disconnected user, or the name of the group

    """


    db,cur = _get_db() 
        
    try:
        cur.execute("INSERT INTO `menu_node` VALUES ()")
        id_node=int(cur.lastrowid)
        cur.execute("INSERT INTO `menu_menu` (`id_node`, `group`, `style`, `title`, `link`, `image`) VALUES (%s,%s,%s,%s,%s,%s)", [id_node,group,style, title, link, image])
        db.commit() 
    except:        
        raise MoulinetteError(169, m18n.n('menu_creation_failed'))
    
    _close_db(db,cur)    
    msignals.display(m18n.n('menu_created'), 'success')
    #hook_result=hook_callback('post_menu_create', [id_node, group,style, title, link, image])
                
    o= { 'id' : id_node, 
        'group':group, 
        'style':style}
        
    if title:
        o['title']=title
    if link:
        o['link']=link
    if image:
        o['image']=image
    return o

def menu_delete(auth, menu):
    """
    Delete menu

    Keyword argument:
        menu -- Id menu to delete

    """
    
    db,cur = _get_db() 
    try:
        cur.execute("DELETE FROM menu_menu WHERE `id_node`=%s",[menu])
        db.commit() 
    except:
        raise MoulinetteError(169, m18n.n('menu_deletion_failed'))

    _close_db(db,cur)
    msignals.display(m18n.n('menu_deleted'), 'success')

def menu_update(auth, menu, group='public',style='default', title=None, link='#', image=None):
    """
    Update menu

    Keyword argument:
        group -- public for disconnected user, or the name of the group

    """
    
    db,cur = _get_db() 
        
    try:
        cur.execute("UPDATE `menu_menu` SET `group`=%s, `style`=%s, `title`=%s, `link`=%s, `image`=%s WHERE `id_node`=%s", [group,style, title, link, image,menu])
        db.commit() 
    except:        
        raise MoulinetteError(169, m18n.n('menu_update_failed'))
    
    _close_db(db,cur)    
    msignals.display(m18n.n('menu_updated'), 'success')
    #hook_result=hook_callback('post_menu_update', [menu, group, style, title, link, image])
                    
    o= { 'id' : menu, 
        'group':group, 
        'style':style}
    if title:
        o['title']=title
    if link:
        o['link']=link
    if image:
        o['image']=image
    return o
    
def menu_info(menu):
    """
    Get menu informations

    Keyword argument:
        menu -- Id menu to delete

    """
    
    db,cur = _get_db() 
    
    cur.execute("SELECT * FROM menu_menu WHERE `id_node`=%s",[menu])
    row = cur.fetchone()

    if row is None:
        raise MoulinetteError(errno.EINVAL, m18n.n('menu_unknown'))
       
    result_dict = {
        'id': row['id_node'],
        'group': row['group'],
        'style': row['style'],
        'tree': _get_tree(cur,menu)
    }
    if row['title']:
        result_dict['title']=row['title']
    if row['link']:
        result_dict['link']=row['link']
    if row['image']:
        result_dict['image']=row['image']

    _close_db(db,cur)
    return result_dict
    
    
def menu_additem(auth, parent, title, order=None, link=None, short_description=None, description=None, icon=None,category=None):
    """
    Add an item to a parent node

    Keyword argument:
        parent -- Id of the parent node (item or menu)
        title -- Title in the menu
        link -- Target of the menu item
        short_description -- Short description of the item
        description -- Description of the item
        icon -- Name of the image file that represents the icon

    """
    db,cur = _get_db() 
    try:
        cur.execute("INSERT INTO `menu_node` () VALUES ()")
        id_node=int(cur.lastrowid)
        cur.execute("INSERT INTO `menu_item` (`id_node`,`title`,`order`,`link`,`short_description`,`description`,`icon`,`category`,`id_parent_node`) \
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)", [id_node,title,int(order),link,short_description,description,icon,category,int(parent)])
        db.commit() 
    except:        
        raise MoulinetteError(169, m18n.n('item_creation_failed'))
       
    _close_db(db,cur)  
    msignals.display(m18n.n('item_created'), 'success')
    #hook_result=hook_callback('post_item_create', [id_node,title,int(order),link,short_description,description,icon,category,parent])
                
    o= { 
        'id' : id_node, 
        'parent':parent
    }  
    
    if title:
        o['title']=title
    if order:
        o['order']=order
    if link:
        o['link']=link
    if short_description:
        o['short_description']=short_description
    if description:
        o['description']=description
    if icon:
        o['icon']=icon
    if category:
        o['category']=category 
    return o

def menu_deleteitem(auth, item):
    """
    Delete item

    Keyword argument:
        item -- Id item to delete

    """
    
    db,cur = _get_db() 
    
    try:
        cur.execute("DELETE FROM `menu_item` WHERE `id_node`=%s",[int(item)])
        db.commit() 
    except:
        raise MoulinetteError(169, m18n.n('item_deletion_failed'))
    _close_db(db,cur)
    msignals.display(m18n.n('item_deleted'), 'success')
   
    
def menu_updateitem(auth, item, parent, title, order=None, link=None, short_description=None, description=None, icon=None, category=None):
    """
    Update an item

    Keyword argument:
        parent -- Id of the parent node (item or menu)
        title -- Title in the menu
        link -- Target of the menu item
        short_description -- Short description of the item
        description -- Description of the item
        icon -- Name of the image file that represents the icon

    """ 
    
    db,cur = _get_db() 
    try:
        cur.execute("UPDATE `menu_item` SET `title`=%s,`order`=%s,`link`=%s,`short_description`=%s,`description`=%s,`icon`=%s,`category`=%s,`id_parent_node`=%s WHERE `id_node`=%s", [title,int(order),link,short_description,description,icon,category,int(parent),item])
        db.commit() 
    except:        
        raise MoulinetteError(169, m18n.n('item_creation_failed'))
       
    _close_db(db,cur)  
    msignals.display(m18n.n('item_created'), 'success')
    #hook_result=hook_callback('post_item_create', [item,title,int(order),link,short_description,description,icon,category,parent])
                
    o= { 
        'id' : item, 
        'parent':parent
    }  
    
    if title:
        o['title']=title
    if order:
        o['order']=order
    if link:
        o['link']=link
    if short_description:
        o['short_description']=short_description
    if description:
        o['description']=description
    if icon:
        o['icon']=icon
    if category:
        o['category']=category    
    return o
   
def _close_db(db,cur):
    if cur:
        cur.close()
    if db:
        db.close()


def _get_db():

    try:
        mysql_root_pwd = open('/etc/yunohost/mysql').read().rstrip()
        db = MySQLdb.connect(host="localhost", user="root",
            passwd=mysql_root_pwd, 
            db="menu")
    except _mysql.Error, e:
        raise MoulinetteError(169, m18n.n('connection error'))
    return  (db,db.cursor(MySQLdb.cursors.DictCursor))


def _get_tree(cur, id_node):
    tree=[]  
    cur.execute("SELECT `id_node`,`title`,`order`,`link`,`short_description`,`description`,`icon`,`category` FROM `menu_item` WHERE `id_parent_node`=%s ORDER BY `order`",[int(id_node)])
    for row in cur.fetchall():
        o={
            'id':row['id_node'],
            'tree':_get_tree(cur, row['id_node'])
        }
        if row['title']:
            o['title']=row['title']
        if row['order']:
            o['order']=row['order']
        if row['link']:
            o['link']=row['link']
        if row['short_description']:
            o['short_description']=row['short_description']
        if row['description']:
            o['description']=row['description']
        if row['icon']:
            o['icon']=row['icon']
        if row['category']:
            o['category']=row['category']
        tree.append(o)
    return tree
