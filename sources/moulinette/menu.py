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
        'id': row[0],
        'group': row[1],
        'style': row[2],
        'title': row[3],
        'link': row[4],
        'image': row[5]}
        if info:
            o['tree']=_get_tree(cur,row[0])
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
    hook_result=hook_callback('post_menu_create', [id_node, group,style, title, link, image])
                
    return { 'id' : id_node, 'group':group}

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

def menu_update(auth, group='public',style=None, title=None, link='#', image=None):
    """
    Update menu

    Keyword argument:
        group -- public for disconnected user, or the name of the group

    """
    pass
    
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
        'id': row[0],
        'group': row[1],
        'style': row[2],
        'title': row[3],
        'link': row[4],
        'image': row[5],
        'tree': _get_tree(cur,menu)
    }

    _close_db(db,cur)
    return result_dict
    
    
def menu_add_item(auth, parent, title, order=None, link=None, short_description=None, description=None, icon=None,_class=None):
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
        cur.execute("INSERT INTO `menu_item` (`id_node`,`title`,`order`,`link`,`short_description`,`description`,`icon`,`class`,`id_parent_node`) \
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)", [id_node,title,int(order),link,short_description,description,icon,_class,int(parent)])
        db.commit() 
    except:        
        raise MoulinetteError(169, m18n.n('item_creation_failed'))
       
    _close_db(db,cur)  
    msignals.display(m18n.n('item_created'), 'success')
    hook_result=hook_callback('post_item_create', [id_node,title,int(order),link,short_description,description,icon,_class,parent])
                
    return { 
        'id' : id_node, 
        'title':title, 
        'order':order, 
        'link':link, 
        'short_description':short_description, 
        'description':description, 
        'icon':icon, 
        'class':_class, 
        'parent':parent
    }

def menu_delete_item(auth, item):
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
   
    
def menu_update_item(auth, parent, title, order=None, link=None, short_description=None, description=None, icon=None, _class=None):
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
    pass       
   
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
    return  (db,db.cursor())


def _get_tree(cur, id_node):
    tree=[]  
    cur.execute("SELECT `id_node`,`title`,`order`,`link`,`short_description`,`description`,`icon`,`class` FROM `menu_item` WHERE `id_parent_node`=%s ORDER BY `order`",[int(id_node)])
    for row in cur.fetchall():
        tree.append({
            'id':row[0],
            'title':row['title'],
            'order':row['order'],
            'link':row['link'],
            'short_description':row['short_description'],
            'description':row['description'],
            'icon':row['icon'],
            'class':row['class'],
            'tree':_get_tree(cur, row[0])
        })
    return tree
