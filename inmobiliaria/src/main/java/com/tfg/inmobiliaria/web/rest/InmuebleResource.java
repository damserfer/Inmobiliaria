package com.tfg.inmobiliaria.web.rest;

import com.tfg.inmobiliaria.domain.Inmueble;
import com.tfg.inmobiliaria.repository.InmuebleRepository;
import com.tfg.inmobiliaria.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.tfg.inmobiliaria.domain.Inmueble}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class InmuebleResource {

    private final Logger log = LoggerFactory.getLogger(InmuebleResource.class);

    private static final String ENTITY_NAME = "inmueble";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InmuebleRepository inmuebleRepository;

    public InmuebleResource(InmuebleRepository inmuebleRepository) {
        this.inmuebleRepository = inmuebleRepository;
    }

    /**
     * {@code POST  /inmuebles} : Create a new inmueble.
     *
     * @param inmueble the inmueble to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new inmueble, or with status {@code 400 (Bad Request)} if the inmueble has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/inmuebles")
    public ResponseEntity<Inmueble> createInmueble(@RequestBody Inmueble inmueble) throws URISyntaxException {
        log.debug("REST request to save Inmueble : {}", inmueble);
        if (inmueble.getId() != null) {
            throw new BadRequestAlertException("A new inmueble cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Inmueble result = inmuebleRepository.save(inmueble);
        return ResponseEntity
            .created(new URI("/api/inmuebles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /inmuebles/:id} : Updates an existing inmueble.
     *
     * @param id the id of the inmueble to save.
     * @param inmueble the inmueble to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated inmueble,
     * or with status {@code 400 (Bad Request)} if the inmueble is not valid,
     * or with status {@code 500 (Internal Server Error)} if the inmueble couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/inmuebles/{id}")
    public ResponseEntity<Inmueble> updateInmueble(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Inmueble inmueble
    ) throws URISyntaxException {
        log.debug("REST request to update Inmueble : {}, {}", id, inmueble);
        if (inmueble.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, inmueble.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!inmuebleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Inmueble result = inmuebleRepository.save(inmueble);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, inmueble.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /inmuebles/:id} : Partial updates given fields of an existing inmueble, field will ignore if it is null
     *
     * @param id the id of the inmueble to save.
     * @param inmueble the inmueble to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated inmueble,
     * or with status {@code 400 (Bad Request)} if the inmueble is not valid,
     * or with status {@code 404 (Not Found)} if the inmueble is not found,
     * or with status {@code 500 (Internal Server Error)} if the inmueble couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/inmuebles/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Inmueble> partialUpdateInmueble(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Inmueble inmueble
    ) throws URISyntaxException {
        log.debug("REST request to partial update Inmueble partially : {}, {}", id, inmueble);
        if (inmueble.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, inmueble.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!inmuebleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Inmueble> result = inmuebleRepository
            .findById(inmueble.getId())
            .map(
                existingInmueble -> {
                    if (inmueble.getCalle() != null) {
                        existingInmueble.setCalle(inmueble.getCalle());
                    }
                    if (inmueble.getNumero() != null) {
                        existingInmueble.setNumero(inmueble.getNumero());
                    }
                    if (inmueble.getEscalera() != null) {
                        existingInmueble.setEscalera(inmueble.getEscalera());
                    }
                    if (inmueble.getCodPostal() != null) {
                        existingInmueble.setCodPostal(inmueble.getCodPostal());
                    }
                    if (inmueble.getCiudad() != null) {
                        existingInmueble.setCiudad(inmueble.getCiudad());
                    }
                    if (inmueble.getDescripcion() != null) {
                        existingInmueble.setDescripcion(inmueble.getDescripcion());
                    }
                    if (inmueble.getNbanios() != null) {
                        existingInmueble.setNbanios(inmueble.getNbanios());
                    }

                    return existingInmueble;
                }
            )
            .map(inmuebleRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, inmueble.getId().toString())
        );
    }

    /**
     * {@code GET  /inmuebles} : get all the inmuebles.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of inmuebles in body.
     */
    @GetMapping("/inmuebles")
    public List<Inmueble> getAllInmuebles() {
        log.debug("REST request to get all Inmuebles");
        return inmuebleRepository.findAll();
    }

    /**
     * {@code GET  /inmuebles/:id} : get the "id" inmueble.
     *
     * @param id the id of the inmueble to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the inmueble, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/inmuebles/{id}")
    public ResponseEntity<Inmueble> getInmueble(@PathVariable Long id) {
        log.debug("REST request to get Inmueble : {}", id);
        Optional<Inmueble> inmueble = inmuebleRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(inmueble);
    }

    /**
     * {@code DELETE  /inmuebles/:id} : delete the "id" inmueble.
     *
     * @param id the id of the inmueble to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/inmuebles/{id}")
    public ResponseEntity<Void> deleteInmueble(@PathVariable Long id) {
        log.debug("REST request to delete Inmueble : {}", id);
        inmuebleRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
