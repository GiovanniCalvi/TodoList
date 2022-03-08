package com.digitazon.TodoList.controllers;

import com.digitazon.TodoList.repositories.TaskRepository;
import org.springframework.web.bind.annotation.*;

@RestController //a tempo di compilazione le annotazioni scrivono del codice per noi (non tutte)
public class TaskController {
    private TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    //@RequestMapping(value = "/", method = RequestMethod.GET)
    @GetMapping("/")
    public String home() {
        long tot = taskRepository.count();
        System.out.println(tot);
        return "benvenuti";
    }
}
