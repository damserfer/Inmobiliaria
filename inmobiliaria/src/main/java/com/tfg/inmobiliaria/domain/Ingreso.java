package com.tfg.inmobiliaria.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;

/**
 * A Ingreso.
 */
@Entity
@Table(name = "ingreso")
public class Ingreso implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mes")
    private LocalDate mes;

    @Column(name = "concepto")
    private String concepto;

    @Column(name = "cantidad")
    private Integer cantidad;

    @JsonIgnoreProperties(value = { "ingreso", "contrato" }, allowSetters = true)
    @OneToOne(mappedBy = "ingreso")
    private Cargo cargo;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ingreso id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getMes() {
        return this.mes;
    }

    public Ingreso mes(LocalDate mes) {
        this.mes = mes;
        return this;
    }

    public void setMes(LocalDate mes) {
        this.mes = mes;
    }

    public String getConcepto() {
        return this.concepto;
    }

    public Ingreso concepto(String concepto) {
        this.concepto = concepto;
        return this;
    }

    public void setConcepto(String concepto) {
        this.concepto = concepto;
    }

    public Integer getCantidad() {
        return this.cantidad;
    }

    public Ingreso cantidad(Integer cantidad) {
        this.cantidad = cantidad;
        return this;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Cargo getCargo() {
        return this.cargo;
    }

    public Ingreso cargo(Cargo cargo) {
        this.setCargo(cargo);
        return this;
    }

    public void setCargo(Cargo cargo) {
        if (this.cargo != null) {
            this.cargo.setIngreso(null);
        }
        if (cargo != null) {
            cargo.setIngreso(this);
        }
        this.cargo = cargo;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ingreso)) {
            return false;
        }
        return id != null && id.equals(((Ingreso) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ingreso{" +
            "id=" + getId() +
            ", mes='" + getMes() + "'" +
            ", concepto='" + getConcepto() + "'" +
            ", cantidad=" + getCantidad() +
            "}";
    }
}
