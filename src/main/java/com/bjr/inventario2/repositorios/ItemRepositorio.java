package com.bjr.inventario2.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bjr.inventario2.modelos.itemModelo;

public interface ItemRepositorio extends JpaRepository<itemModelo, Long>{

}
