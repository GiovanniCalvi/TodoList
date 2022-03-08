package com.digitazon.TodoList.entities;

import javax.persistence.*;


@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String name;
    private String color;

    public Category() {
    }

    public Category(int id, String name, String color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

}
