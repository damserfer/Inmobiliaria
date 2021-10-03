package com.tfg.inmobiliaria.web.rest;

import com.tfg.inmobiliaria.domain.Ingreso;
import com.tfg.inmobiliaria.repository.IngresoRepository;
import com.tfg.inmobiliaria.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.tfg.inmobiliaria.domain.Ingreso}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class IngresoResource {

    private final Logger log = LoggerFactory.getLogger(IngresoResource.class);

    private static final String ENTITY_NAME = "ingreso";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IngresoRepository ingresoRepository;

    public IngresoResource(IngresoRepository ingresoRepository) {
        this.ingresoRepository = ingresoRepository;
    }

    /**
     * {@code POST  /ingresos} : Create a new ingreso.
     *
     * @param ingreso the ingreso to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ingreso, or with status {@code 400 (Bad Request)} if the ingreso has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ingresos")
    public ResponseEntity<Ingreso> createIngreso(@RequestBody Ingreso ingreso) throws URISyntaxException {
        log.debug("REST request to save Ingreso : {}", ingreso);
        if (ingreso.getId() != null) {
            throw new BadRequestAlertException("A new ingreso cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ingreso result = ingresoRepository.save(ingreso);
        return ResponseEntity
            .created(new URI("/api/ingresos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ingresos/:id} : Updates an existing ingreso.
     *
     * @param id the id of the ingreso to save.
     * @param ingreso the ingreso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ingreso,
     * or with status {@code 400 (Bad Request)} if the ingreso is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ingreso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ingresos/{id}")
    public ResponseEntity<Ingreso> updateIngreso(@PathVariable(value = "id", required = false) final Long id, @RequestBody Ingreso ingreso)
        throws URISyntaxException {
        log.debug("REST request to update Ingreso : {}, {}", id, ingreso);
        if (ingreso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ingreso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ingresoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Ingreso result = ingresoRepository.save(ingreso);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ingreso.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ingresos/:id} : Partial updates given fields of an existing ingreso, field will ignore if it is null
     *
     * @param id the id of the ingreso to save.
     * @param ingreso the ingreso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ingreso,
     * or with status {@code 400 (Bad Request)} if the ingreso is not valid,
     * or with status {@code 404 (Not Found)} if the ingreso is not found,
     * or with status {@code 500 (Internal Server Error)} if the ingreso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ingresos/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Ingreso> partialUpdateIngreso(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Ingreso ingreso
    ) throws URISyntaxException {
        log.debug("REST request to partial update Ingreso partially : {}, {}", id, ingreso);
        if (ingreso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ingreso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ingresoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ingreso> result = ingresoRepository
            .findById(ingreso.getId())
            .map(
                existingIngreso -> {
                    if (ingreso.getMes() != null) {
                        existingIngreso.setMes(ingreso.getMes());
                    }
                    if (ingreso.getConcepto() != null) {
                        existingIngreso.setConcepto(ingreso.getConcepto());
                    }
                    if (ingreso.getCantidad() != null) {
                        existingIngreso.setCantidad(ingreso.getCantidad());
                    }

                    return existingIngreso;
                }
            )
            .map(ingresoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ingreso.getId().toString())
        );
    }

    /**
     * {@code GET  /ingresos} : get all the ingresos.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ingresos in body.
     */
    @GetMapping("/ingresos")
    public List<Ingreso> getAllIngresos(@RequestParam(required = false) String filter) {
        if ("cargo-is-null".equals(filter)) {
            log.debug("REST request to get all Ingresos where cargo is null");
            return StreamSupport
                .stream(ingresoRepository.findAll().spliterator(), false)
                .filter(ingreso -> ingreso.getCargo() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Ingresos");
        return ingresoRepository.findAll();
    }

    /**
     * {@code GET  /ingresos/:id} : get the "id" ingreso.
     *
     * @param id the id of the ingreso to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ingreso, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ingresos/{id}")
    public ResponseEntity<Ingreso> getIngreso(@PathVariable Long id) {
        log.debug("REST request to get Ingreso : {}", id);
        Optional<Ingreso> ingreso = ingresoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(ingreso);
    }

    /**
     * {@code DELETE  /ingresos/:id} : delete the "id" ingreso.
     *
     * @param id the id of the ingreso to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ingresos/{id}")
    public ResponseEntity<Void> deleteIngreso(@PathVariable Long id) {
        log.debug("REST request to delete Ingreso : {}", id);
        ingresoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
