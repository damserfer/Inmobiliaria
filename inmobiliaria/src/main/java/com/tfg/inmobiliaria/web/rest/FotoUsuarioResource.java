package com.tfg.inmobiliaria.web.rest;

import com.tfg.inmobiliaria.domain.FotoUsuario;
import com.tfg.inmobiliaria.repository.FotoUsuarioRepository;
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
 * REST controller for managing {@link com.tfg.inmobiliaria.domain.FotoUsuario}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FotoUsuarioResource {

    private final Logger log = LoggerFactory.getLogger(FotoUsuarioResource.class);

    private static final String ENTITY_NAME = "fotoUsuario";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FotoUsuarioRepository fotoUsuarioRepository;

    public FotoUsuarioResource(FotoUsuarioRepository fotoUsuarioRepository) {
        this.fotoUsuarioRepository = fotoUsuarioRepository;
    }

    /**
     * {@code POST  /foto-usuarios} : Create a new fotoUsuario.
     *
     * @param fotoUsuario the fotoUsuario to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fotoUsuario, or with status {@code 400 (Bad Request)} if the fotoUsuario has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/foto-usuarios")
    public ResponseEntity<FotoUsuario> createFotoUsuario(@RequestBody FotoUsuario fotoUsuario) throws URISyntaxException {
        log.debug("REST request to save FotoUsuario : {}", fotoUsuario);
        if (fotoUsuario.getId() != null) {
            throw new BadRequestAlertException("A new fotoUsuario cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FotoUsuario result = fotoUsuarioRepository.save(fotoUsuario);
        return ResponseEntity
            .created(new URI("/api/foto-usuarios/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /foto-usuarios/:id} : Updates an existing fotoUsuario.
     *
     * @param id the id of the fotoUsuario to save.
     * @param fotoUsuario the fotoUsuario to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fotoUsuario,
     * or with status {@code 400 (Bad Request)} if the fotoUsuario is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fotoUsuario couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/foto-usuarios/{id}")
    public ResponseEntity<FotoUsuario> updateFotoUsuario(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FotoUsuario fotoUsuario
    ) throws URISyntaxException {
        log.debug("REST request to update FotoUsuario : {}, {}", id, fotoUsuario);
        if (fotoUsuario.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fotoUsuario.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fotoUsuarioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FotoUsuario result = fotoUsuarioRepository.save(fotoUsuario);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fotoUsuario.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /foto-usuarios/:id} : Partial updates given fields of an existing fotoUsuario, field will ignore if it is null
     *
     * @param id the id of the fotoUsuario to save.
     * @param fotoUsuario the fotoUsuario to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fotoUsuario,
     * or with status {@code 400 (Bad Request)} if the fotoUsuario is not valid,
     * or with status {@code 404 (Not Found)} if the fotoUsuario is not found,
     * or with status {@code 500 (Internal Server Error)} if the fotoUsuario couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/foto-usuarios/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<FotoUsuario> partialUpdateFotoUsuario(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FotoUsuario fotoUsuario
    ) throws URISyntaxException {
        log.debug("REST request to partial update FotoUsuario partially : {}, {}", id, fotoUsuario);
        if (fotoUsuario.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fotoUsuario.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fotoUsuarioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FotoUsuario> result = fotoUsuarioRepository
            .findById(fotoUsuario.getId())
            .map(
                existingFotoUsuario -> {
                    if (fotoUsuario.getUrl() != null) {
                        existingFotoUsuario.setUrl(fotoUsuario.getUrl());
                    }

                    return existingFotoUsuario;
                }
            )
            .map(fotoUsuarioRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fotoUsuario.getId().toString())
        );
    }

    /**
     * {@code GET  /foto-usuarios} : get all the fotoUsuarios.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fotoUsuarios in body.
     */
    @GetMapping("/foto-usuarios")
    public List<FotoUsuario> getAllFotoUsuarios() {
        log.debug("REST request to get all FotoUsuarios");
        return fotoUsuarioRepository.findAll();
    }

    /**
     * {@code GET  /foto-usuarios/:id} : get the "id" fotoUsuario.
     *
     * @param id the id of the fotoUsuario to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fotoUsuario, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/foto-usuarios/{id}")
    public ResponseEntity<FotoUsuario> getFotoUsuario(@PathVariable Long id) {
        log.debug("REST request to get FotoUsuario : {}", id);
        Optional<FotoUsuario> fotoUsuario = fotoUsuarioRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(fotoUsuario);
    }

    /**
     * {@code DELETE  /foto-usuarios/:id} : delete the "id" fotoUsuario.
     *
     * @param id the id of the fotoUsuario to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/foto-usuarios/{id}")
    public ResponseEntity<Void> deleteFotoUsuario(@PathVariable Long id) {
        log.debug("REST request to delete FotoUsuario : {}", id);
        fotoUsuarioRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
