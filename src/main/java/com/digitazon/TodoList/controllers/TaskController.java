package com.digitazon.TodoList.controllers;

import com.digitazon.TodoList.entities.Task;
import com.digitazon.TodoList.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController //a tempo di compilazione le annotazioni scrivono del codice per noi (non tutte)
@RequestMapping("/tasks")
@CrossOrigin(origins = "*")
public class TaskController {
    @Autowired
    private TaskRepository taskRepository;

    /*public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }*/

    //@RequestMapping(value = "/", method = RequestMethod.GET)
    @GetMapping("/")
    public Iterable<Task> home() {
        Iterable<Task> tasks = taskRepository.findAll();
        System.out.println(tasks);
        return tasks;
    }

    @GetMapping("/{id}")
    public Task read(@PathVariable int id) {
        return taskRepository.findById(id).orElseThrow();
    }

    @PostMapping("/add")
    public Task create(@RequestBody Task newTask) {
        return taskRepository.save(newTask);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable int id) {
        taskRepository.deleteById(id);
        return "ok";
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable int id, @RequestBody Task updatedTask) {
        Task task = taskRepository.findById(id).orElseThrow();
        task.setDone(updatedTask.isDone());
        task.setName(updatedTask.getName());
        return taskRepository.save(task);
    }

    @PostMapping("/{id}/delete")
    public String alternativeDelete(@PathVariable int id) {
        taskRepository.deleteById(id);
        return "ok";
    }

    @PostMapping("/{id}/update")
    public Task alternativeUpdate(@PathVariable int id, @RequestBody Task updatedTask) {
        Task task = taskRepository.findById(id).orElseThrow();
        task.setDone(updatedTask.isDone());
        task.setName(updatedTask.getName());
        return taskRepository.save(task);
    }

    /**
     * Creare una versione alternativa dei metodi delete e update (alternativeDelete, alternativeUpdate) che lavorino
     * in POST ai seguenti indirizzi
     * tasks/{id}/edit
     * tasks/{id}/delete
     * @Postmapping("/{id}/edit") fare prova facendo piccola modifica nella richiesta ajax
     */
}
