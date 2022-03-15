package com.digitazon.TodoList.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;


@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String name;
    private String color;
    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Task> tasks;

    public Category() {
    }

    public Category(int id, String name, String color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
