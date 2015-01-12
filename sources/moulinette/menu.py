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


	
	
def menu_list(auth):
    """
    List menus

    """
    cur = _get_db() 
    cur.execute("SELECT id_node,group FROM menu_menu")
    result_list=[]
    for row in cur.fetchall() :
        result_list.append({
        'id': row[0],
        'group': row[1]})

    return { 'menus' : result_list }

def menu_create(auth, group=None):
    """
    Create menu

    Keyword argument:
        group -- None for disconnected user, or the name of the group

    """
    from yunohost.hook import hook_callback


    cur = _get_db() 
        
    try:
        cur.execute("INSERT INTO `menu_node`")
        cur.execute("INSERT INTO `menu_menu` (`id_node`, `group`) VALUES (%d,%s)", [id_node,group])
        
    except:        
        raise MoulinetteError(169, m18n.n('menu_creation_failed'))
        
    msignals.display(m18n.n('menu_created'), 'success')
    hook_result=hook_callback('post_menu_create', [id_node, group])
                
    return { 'id' : id_node, 'group':group}

def menu_delete(auth, menu):
    """
    Delete menu

    Keyword argument:
        menu -- Id menu to delete

    """
    
    cur = _get_db() 
    
    cur.execute("DELETE FROM menu_menu WHERE `id_node`=%d",[menu])
    
    if False:
        raise MoulinetteError(169, m18n.n('menu_deletion_failed'))

    msignals.display(m18n.n('menu_deleted'), 'success')

def menu_info(auth, menu):
    """
    Get menu informations

    Keyword argument:
        menu -- Id menu to delete

    """
    
    cur = _get_db() 
    
    cur.execute("SELECT * FROM menu_menu WHERE `id_node`=%s",[menu])
    row = cur.fetchone()

    if row is None:
        raise MoulinetteError(errno.EINVAL, m18n.n('menu_unknown'))
        
    result_dict = {
        'menu': row[0],
        'group': row[1],
        'tree': _get_tree(cur,menu)
    }

    return result_dict
    
    
def menu_add_item(auth, parent, title, link=None, short_description=None, description=None, icon=None):
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
    cur = _get_db() 
    try:
        cur.execute("INSERT INTO `menu_node`")
        cur.execute("INSERT INTO `menu_item` (`id_node`,`title`,`link`,`short_description`,`description`,`icon`,`id_parent_node`) \
        VALUES (%d,%s,%s,%s,%s,%s,%d)", [id_node,title,link,short_description,description,icon,parent])
        
    except:        
        raise MoulinetteError(169, m18n.n('item_creation_failed'))
        
    msignals.display(m18n.n('item_created'), 'success')
    hook_result=hook_callback('post_item_create', [id_node,title,link,short_description,description,icon,parent])
                
    return { 
        'id' : id_node, 
        'title':title, 
        'link':link, 
        'short_description':short_description, 
        'description':description, 
        'icon':icon, 
        'parent':parent
    }

def menu_delete_item(auth, item):
    """
    Delete item

    Keyword argument:
        item -- Id item to delete

    """
    
    cur = _get_db() 
    
    cur.execute("DELETE FROM menu_item WHERE `id_node`=%d",[item])
    
    if False:
        raise MoulinetteError(169, m18n.n('item_deletion_failed'))

    msignals.display(m18n.n('item_deleted'), 'success')
          
   
        
def _get_db():

    mysql_root_pwd = open('/etc/yunohost/mysql').read().rstrip()
    db = MySQLdb.connect(host="localhost", user="root",
        passwd=mysql_root_pwd, 
        db="menu")
         
    return  db.cursor() 
    
def _get_tree(cur, id_node):
    tree=[]    
    cur.execute("SELECT `id_node`,`title`,`link`,`short_description`,`description`,`icon`,`id_parent_node` FROM `menu_item` WHERE `id_parent_node`=%d",[id_node])
    for row in cur.fetchall():
        tree.append({
            id:row[0],
            title:row[1],
            link:row[2],
            short_description:row[3],
            description:row[4],
            icon:row[5],
            tree:_get_tree(row[6])
        })
    return tree
