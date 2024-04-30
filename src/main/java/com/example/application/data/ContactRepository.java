package com.example.application.data;


import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface ContactRepository extends CrudRepository<Contact, Long> {

    @Query("SELECT c FROM Contact c JOIN FETCH c.company")
    List<Contact> findAllWithCompany();

    void deleteById(Long id);


}
