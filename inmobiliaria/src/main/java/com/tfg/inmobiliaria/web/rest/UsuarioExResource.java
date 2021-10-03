package com.tfg.inmobiliaria.web.rest;

import com.tfg.inmobiliaria.domain.UsuarioEx;
import com.tfg.inmobiliaria.repository.UsuarioExRepository;
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
 * REST controller for managing {@link com.tfg.inmobiliaria.domain.UsuarioEx}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UsuarioExResource {

    private final Logger log = LoggerFactory.getLogger(UsuarioExResource.class);

    private static final String ENTITY_NAME = "usuarioEx";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UsuarioExRepository usuarioExRepository;

    public UsuarioExResource(UsuarioExRepository usuarioExRepository) {
        this.usuarioExRepository = usuarioExRepository;
    }

    /**
     * {@code POST  /usuario-exes} : Create a new usuarioEx.
     *
     * @param usuarioEx the usuarioEx to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new usuarioEx, or with status {@code 400 (Bad Request)} if the usuarioEx has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/usuario-exes")
    public ResponseEntity<UsuarioEx> createUsuarioEx(@RequestBody UsuarioEx usuarioEx) throws URISyntaxException {
        log.debug("REST request to save UsuarioEx : {}", usuarioEx);
        if (usuarioEx.getId() != null) {
            throw new BadRequestAlertException("A new usuarioEx cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UsuarioEx result = usuarioExRepository.save(usuarioEx);
        return ResponseEntity
            .created(new URI("/api/usuario-exes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /usuario-exes/:id} : Updates an existing usuarioEx.
     *
     * @param id the id of the usuarioEx to save.
     * @param usuarioEx the usuarioEx to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated usuarioEx,
     * or with status {@code 400 (Bad Request)} if the usuarioEx is not valid,
     * or with status {@code 500 (Internal Server Error)} if the usuarioEx couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/usuario-exes/{id}")
    public ResponseEntity<UsuarioEx> updateUsuarioEx(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UsuarioEx usuarioEx
    ) throws URISyntaxException {
        log.debug("REST request to update UsuarioEx : {}, {}", id, usuarioEx);
        if (usuarioEx.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, usuarioEx.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!usuarioExRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UsuarioEx result = usuarioExRepository.save(usuarioEx);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, usuarioEx.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /usuario-exes/:id} : Partial updates given fields of an existing usuarioEx, field will ignore if it is null
     *
     * @param id the id of the usuarioEx to save.
     * @param usuarioEx the usuarioEx to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated usuarioEx,
     * or with status {@code 400 (Bad Request)} if the usuarioEx is not valid,
     * or with status {@code 404 (Not Found)} if the usuarioEx is not found,
     * or with status {@code 500 (Internal Server Error)} if the usuarioEx couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/usuario-exes/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<UsuarioEx> partialUpdateUsuarioEx(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UsuarioEx usuarioEx
    ) throws URISyntaxException {
        log.debug("REST request to partial update UsuarioEx partially : {}, {}", id, usuarioEx);
        if (usuarioEx.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, usuarioEx.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!usuarioExRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UsuarioEx> result = usuarioExRepository
            .findById(usuarioEx.getId())
            .map(
                existingUsuarioEx -> {
                    if (usuarioEx.getDni() != null) {
                        existingUsuarioEx.setDni(usuarioEx.getDni());
                    }
                    if (usuarioEx.getNombre() != null) {
                        existingUsuarioEx.setNombre(usuarioEx.getNombre());
                    }
                    if (usuarioEx.getApellidos() != null) {
                        existingUsuarioEx.setApellidos(usuarioEx.getApellidos());
                    }
                    if (usuarioEx.getPassword() != null) {
                        existingUsuarioEx.setPassword(usuarioEx.getPassword());
                    }

                    return existingUsuarioEx;
                }
            )
            .map(usuarioExRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, usuarioEx.getId().toString())
        );
    }

    /**
     * {@code GET  /usuario-exes} : get all the usuarioExes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of usuarioExes in body.
     */
    @GetMapping("/usuario-exes")
    public List<UsuarioEx> getAllUsuarioExes() {
        log.debug("REST request to get all UsuarioExes");
        return usuarioExRepository.findAll();
    }

    /**
     * {@code GET  /usuario-exes/:id} : get the "id" usuarioEx.
     *
     * @param id the id of the usuarioEx to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the usuarioEx, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/usuario-exes/{id}")
    public ResponseEntity<UsuarioEx> getUsuarioEx(@PathVariable Long id) {
        log.debug("REST request to get UsuarioEx : {}", id);
        Optional<UsuarioEx> usuarioEx = usuarioExRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(usuarioEx);
    }

    /**
     * {@code DELETE  /usuario-exes/:id} : delete the "id" usuarioEx.
     *
     * @param id the id of the usuarioEx to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/usuario-exes/{id}")
    public ResponseEntity<Void> deleteUsuarioEx(@PathVariable Long id) {
        log.debug("REST request to delete UsuarioEx : {}", id);
        usuarioExRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
