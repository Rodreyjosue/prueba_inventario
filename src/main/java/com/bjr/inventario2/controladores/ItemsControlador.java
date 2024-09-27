package com.bjr.inventario2.controladores;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bjr.inventario2.modelos.itemModelo;
import com.bjr.inventario2.repositorios.ItemRepositorio;

@RestController
@RequestMapping("/inventario2")
public class ItemsControlador {

    @Autowired
    private ItemRepositorio repositorio;

    @GetMapping
    public List<itemModelo> todosItems(){
        return repositorio.findAll();
    }

    @GetMapping("/{id}")
    public itemModelo itemPorId(@PathVariable Long id){
        itemModelo item = repositorio.findById(id)
            .orElseThrow(()-> new RuntimeException("Item no existe"));
        
        return item;
    }

    @PostMapping
    public itemModelo crearItem(@RequestBody itemModelo item){
        return repositorio.save(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<itemModelo> actualizarInfo(@PathVariable Long id, @RequestBody itemModelo nuevaInfoItem){
        itemModelo item = repositorio.findById(id)
            .orElseThrow(()-> new RuntimeException("Item no encontrado"));

        item.setNombre(nuevaInfoItem.getNombre());
        item.setDescripcion(nuevaInfoItem.getDescripcion());
        item.setPrecio(nuevaInfoItem.getPrecio());  
        item.setCantidad(nuevaInfoItem.getCantidad());
        
        itemModelo itemActualizado = repositorio.save(item);
        return ResponseEntity.ok(itemActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> EliminarItem(@PathVariable Long id){
        itemModelo item = repositorio.findById(id)
            .orElseThrow(()-> new RuntimeException("Item no encontrado"));

        repositorio.delete(item);
        return ResponseEntity.ok("ITEM ELIMINADO");
    }

}
