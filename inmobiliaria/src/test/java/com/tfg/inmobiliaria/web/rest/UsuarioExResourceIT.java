package com.tfg.inmobiliaria.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tfg.inmobiliaria.IntegrationTest;
import com.tfg.inmobiliaria.domain.UsuarioEx;
import com.tfg.inmobiliaria.repository.UsuarioExRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link UsuarioExResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UsuarioExResourceIT {

    private static final String DEFAULT_DNI = "AAAAAAAAAA";
    private static final String UPDATED_DNI = "BBBBBBBBBB";

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_APELLIDOS = "AAAAAAAAAA";
    private static final String UPDATED_APELLIDOS = "BBBBBBBBBB";

    private static final String DEFAULT_PASSWORD = "AAAAAAAAAA";
    private static final String UPDATED_PASSWORD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/usuario-exes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UsuarioExRepository usuarioExRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUsuarioExMockMvc;

    private UsuarioEx usuarioEx;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UsuarioEx createEntity(EntityManager em) {
        UsuarioEx usuarioEx = new UsuarioEx()
            .dni(DEFAULT_DNI)
            .nombre(DEFAULT_NOMBRE)
            .apellidos(DEFAULT_APELLIDOS)
            .password(DEFAULT_PASSWORD);
        return usuarioEx;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UsuarioEx createUpdatedEntity(EntityManager em) {
        UsuarioEx usuarioEx = new UsuarioEx()
            .dni(UPDATED_DNI)
            .nombre(UPDATED_NOMBRE)
            .apellidos(UPDATED_APELLIDOS)
            .password(UPDATED_PASSWORD);
        return usuarioEx;
    }

    @BeforeEach
    public void initTest() {
        usuarioEx = createEntity(em);
    }

    @Test
    @Transactional
    void createUsuarioEx() throws Exception {
        int databaseSizeBeforeCreate = usuarioExRepository.findAll().size();
        // Create the UsuarioEx
        restUsuarioExMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(usuarioEx)))
            .andExpect(status().isCreated());

        // Validate the UsuarioEx in the database
        List<UsuarioEx> usuarioExList = usuarioExRepository.findAll();
        assertThat(usuarioExList).hasSize(databaseSizeBeforeCreate + 1);
        UsuarioEx testUsuarioEx = usuarioExList.get(usuarioExList.size() - 1);
        assertThat(testUsuarioEx.getDni()).isEqualTo(DEFAULT_DNI);
        assertThat(testUsuarioEx.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testUsuarioEx.getApellidos()).isEqualTo(DEFAULT_APELLIDOS);
        assertThat(testUsuarioEx.getPassword()).isEqualTo(DEFAULT_PASSWORD);
    }

    @Test
    @Transactional
    void createUsuarioExWithExistingId() throws Exception {
        // Create the UsuarioEx with an existing ID
        usuarioEx.setId(1L);

        int databaseSizeBeforeCreate = usuarioExRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUsuarioExMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(usuarioEx)))
            .andExpect(status().isBadRequest());

        // Validate the UsuarioEx in the database
        List<UsuarioEx> usuarioExList = usuarioExRepository.findAll();
        assertThat(usuarioExList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUsuarioExes() throws Exception {
        // Initialize the database
        usuarioExRepository.saveAndFlush(usuarioEx);

        // Get all the usuarioExList
        restUsuarioExMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(usuarioEx.getId().intValue())))
            .andExpect(jsonPath("$.[*].dni").value(hasItem(DEFAULT_DNI)))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].apellidos").value(hasItem(DEFAULT_APELLIDOS)))
            .andExpect(jsonPath("$.[*].password").value(hasItem(DEFAULT_PASSWORD)));
    }

    @Test
    @Transactional
    void getUsuarioEx() throws Exception {
        // Initialize the database
        usuarioExRepository.saveAndFlush(usuarioEx);

        // Get the usuarioEx
        restUsuarioExMockMvc
            .perform(get(ENTITY_API_URL_ID, usuarioEx.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(usuarioEx.getId().intValue()))
            .andExpect(jsonPath("$.dni").value(DEFAULT_DNI))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.apellidos").value(DEFAULT_APELLIDOS))
            .andExpect(jsonPath("$.password").value(DEFAULT_PASSWORD));
    }

    @Test
    @Transactional
    void getNonExistingUsuarioEx() throws Exception {
        // Get the usuarioEx
        restUsuarioExMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUsuarioEx() throws Exception {
        // Initialize the database
        usuarioExRepository.saveAndFlush(usuarioEx);

        int databaseSizeBeforeUpdate = usuarioExRepository.findAll().size();

        // Update the usuarioEx
        UsuarioEx updatedUsuarioEx = usuarioExRepository.findById(usuarioEx.getId()).get();
        // Disconnect from session so that the updates on updatedUsuarioEx are not directly saved in db
        em.detach(updatedUsuarioEx);
        updatedUsuarioEx.dni(UPDATED_DNI).nombre(UPDATED_NOMBRE).apellidos(UPDATED_APELLIDOS).password(UPDATED_PASSWORD);

        restUsuarioExMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUsuarioEx.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUsuarioEx))
            )
            .andExpect(status().isOk());

        // Validate the UsuarioEx in the database
        List<UsuarioEx> usuarioExList = usuarioExRepository.findAll();
        assertThat(usuarioExList).hasSize(databaseSizeBeforeUpdate);
        UsuarioEx testUsuarioEx = usuarioExList.get(usuarioExList.size() - 1);
        assertThat(testUsuarioEx.getDni()).isEqualTo(UPDATED_DNI);
        assertThat(testUsuarioEx.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testUsuarioEx.getApellidos()).isEqualTo(UPDATED_APELLIDOS);
        assertThat(testUsuarioEx.getPassword()).isEqualTo(UPDATED_PASSWORD);
    }

    @Test
    @Transactional
    void putNonExistingUsuarioEx() throws Exception {
        int databaseSizeBeforeUpdate = usuarioExRepository.findAll().size();
        usuarioEx.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUsuarioExMockMvc
            .perform(
                put(ENTITY_API_URL_ID, usuarioEx.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(usuarioEx))
            )
            .andExpect(status().isBadRequest());

        // Validate the UsuarioEx in the database
        List<UsuarioEx> usuarioExList = usuarioExRepository.findAll();
        assertThat(usuarioExList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUsuarioEx() throws Exception {
        int databaseSizeBeforeUpdate = usuarioExRepository.findAll().size();
        usuarioEx.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsuarioExMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(usuarioEx))
            )
            .andExpect(status().isBadRequest());

        // Validate the UsuarioEx in the database
        List<UsuarioEx> usuarioExList = usuarioExRepository.findAll();
        assertThat(usuarioExList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUsuarioEx() throws Exception {
        int databaseSizeBeforeUpdate = usuarioExRepository.findAll().size();
        usuarioEx.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsuarioExMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(usuarioEx)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UsuarioEx in the database
        List<UsuarioEx> usuarioExList = usuarioExRepository.findAll();
        assertThat(usuarioExList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUsuarioExWithPatch() throws Exception {
        // Initialize the database
        usuarioExRepository.saveAndFlush(usuarioEx);

        int databaseSizeBeforeUpdate = usuarioExRepository.findAll().size();

        // Update the usuarioEx using partial update
        UsuarioEx partialUpdatedUsuarioEx = new UsuarioEx();
        partialUpdatedUsuarioEx.setId(usuarioEx.getId());

        partialUpdatedUsuarioEx.nombre(UPDATED_NOMBRE).apellidos(UPDATED_APELLIDOS);

        restUsuarioExMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUsuarioEx.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUsuarioEx))
            )
            .andExpect(status().isOk());

        // Validate the UsuarioEx in the database
        List<UsuarioEx> usuarioExList = usuarioExRepository.findAll();
        assertThat(usuarioExList).hasSize(databaseSizeBeforeUpdate);
        UsuarioEx testUsuarioEx = usuarioExList.get(usuarioExList.size() - 1);
        assertThat(testUsuarioEx.getDni()).isEqualTo(DEFAULT_DNI);
        assertThat(testUsuarioEx.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testUsuarioEx.getApellidos()).isEqualTo(UPDATED_APELLIDOS);
        assertThat(testUsuarioEx.getPassword()).isEqualTo(DEFAULT_PASSWORD);
    }

    @Test
    @Transactional
    void fullUpdateUsuarioExWithPatch() throws Exception {
        // Initialize the database
        usuarioExRepository.saveAndFlush(usuarioEx);

        int databaseSizeBeforeUpdate = usuarioExRepository.findAll().size();

        // Update the usuarioEx using partial update
        UsuarioEx partialUpdatedUsuarioEx = new UsuarioEx();
        partialUpdatedUsuarioEx.setId(usuarioEx.getId());

        partialUpdatedUsuarioEx.dni(UPDATED_DNI).nombre(UPDATED_NOMBRE).apellidos(UPDATED_APELLIDOS).password(UPDATED_PASSWORD);

        restUsuarioExMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUsuarioEx.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUsuarioEx))
            )
            .andExpect(status().isOk());

        // Validate the UsuarioEx in the database
        List<UsuarioEx> usuarioExList = usuarioExRepository.findAll();
        assertThat(usuarioExList).hasSize(databaseSizeBeforeUpdate);
        UsuarioEx testUsuarioEx = usuarioExList.get(usuarioExList.size() - 1);
        assertThat(testUsuarioEx.getDni()).isEqualTo(UPDATED_DNI);
        assertThat(testUsuarioEx.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testUsuarioEx.getApellidos()).isEqualTo(UPDATED_APELLIDOS);
        assertThat(testUsuarioEx.getPassword()).isEqualTo(UPDATED_PASSWORD);
    }

    @Test
    @Transactional
    void patchNonExistingUsuarioEx() throws Exception {
        int databaseSizeBeforeUpdate = usuarioExRepository.findAll().size();
        usuarioEx.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUsuarioExMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, usuarioEx.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(usuarioEx))
            )
            .andExpect(status().isBadRequest());

        // Validate the UsuarioEx in the database
        List<UsuarioEx> usuarioExList = usuarioExRepository.findAll();
        assertThat(usuarioExList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUsuarioEx() throws Exception {
        int databaseSizeBeforeUpdate = usuarioExRepository.findAll().size();
        usuarioEx.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsuarioExMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(usuarioEx))
            )
            .andExpect(status().isBadRequest());

        // Validate the UsuarioEx in the database
        List<UsuarioEx> usuarioExList = usuarioExRepository.findAll();
        assertThat(usuarioExList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUsuarioEx() throws Exception {
        int databaseSizeBeforeUpdate = usuarioExRepository.findAll().size();
        usuarioEx.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsuarioExMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(usuarioEx))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UsuarioEx in the database
        List<UsuarioEx> usuarioExList = usuarioExRepository.findAll();
        assertThat(usuarioExList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUsuarioEx() throws Exception {
        // Initialize the database
        usuarioExRepository.saveAndFlush(usuarioEx);

        int databaseSizeBeforeDelete = usuarioExRepository.findAll().size();

        // Delete the usuarioEx
        restUsuarioExMockMvc
            .perform(delete(ENTITY_API_URL_ID, usuarioEx.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UsuarioEx> usuarioExList = usuarioExRepository.findAll();
        assertThat(usuarioExList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
