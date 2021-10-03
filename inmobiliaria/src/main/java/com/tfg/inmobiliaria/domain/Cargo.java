package com.tfg.inmobiliaria.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tfg.inmobiliaria.domain.enumeration.Concepto;
import com.tfg.inmobiliaria.domain.enumeration.Mes;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;

/**
 * A Cargo.
 */
@Entity
@Table(name = "cargo")
public class Cargo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_cargo")
    private LocalDate fechaCargo;

    @Enumerated(EnumType.STRING)
    @Column(name = "mes")
    private Mes mes;

    @Column(name = "ejercicio")
    private Integer ejercicio;

    @Column(name = "importe_total")
    private Double importeTotal;

    @Column(name = "pagado")
    private Boolean pagado;

    @Enumerated(EnumType.STRING)
    @Column(name = "concepto")
    private Concepto concepto;

    @JsonIgnoreProperties(value = { "cargo" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Ingreso ingreso;

    @ManyToOne
    @JsonIgnoreProperties(value = { "valoracions", "cargos", "usuarioEx", "inmueble" }, allowSetters = true)
    private Contrato contrato;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cargo id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getFechaCargo() {
        return this.fechaCargo;
    }

    public Cargo fechaCargo(LocalDate fechaCargo) {
        this.fechaCargo = fechaCargo;
        return this;
    }

    public void setFechaCargo(LocalDate fechaCargo) {
        this.fechaCargo = fechaCargo;
    }

    public Mes getMes() {
        return this.mes;
    }

    public Cargo mes(Mes mes) {
        this.mes = mes;
        return this;
    }

    public void setMes(Mes mes) {
        this.mes = mes;
    }

    public Integer getEjercicio() {
        return this.ejercicio;
    }

    public Cargo ejercicio(Integer ejercicio) {
        this.ejercicio = ejercicio;
        return this;
    }

    public void setEjercicio(Integer ejercicio) {
        this.ejercicio = ejercicio;
    }

    public Double getImporteTotal() {
        return this.importeTotal;
    }

    public Cargo importeTotal(Double importeTotal) {
        this.importeTotal = importeTotal;
        return this;
    }

    public void setImporteTotal(Double importeTotal) {
        this.importeTotal = importeTotal;
    }

    public Boolean getPagado() {
        return this.pagado;
    }

    public Cargo pagado(Boolean pagado) {
        this.pagado = pagado;
        return this;
    }

    public void setPagado(Boolean pagado) {
        this.pagado = pagado;
    }

    public Concepto getConcepto() {
        return this.concepto;
    }

    public Cargo concepto(Concepto concepto) {
        this.concepto = concepto;
        return this;
    }

    public void setConcepto(Concepto concepto) {
        this.concepto = concepto;
    }

    public Ingreso getIngreso() {
        return this.ingreso;
    }

    public Cargo ingreso(Ingreso ingreso) {
        this.setIngreso(ingreso);
        return this;
    }

    public void setIngreso(Ingreso ingreso) {
        this.ingreso = ingreso;
    }

    public Contrato getContrato() {
        return this.contrato;
    }

    public Cargo contrato(Contrato contrato) {
        this.setContrato(contrato);
        return this;
    }

    public void setContrato(Contrato contrato) {
        this.contrato = contrato;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cargo)) {
            return false;
        }
        return id != null && id.equals(((Cargo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cargo{" +
            "id=" + getId() +
            ", fechaCargo='" + getFechaCargo() + "'" +
            ", mes='" + getMes() + "'" +
            ", ejercicio=" + getEjercicio() +
            ", importeTotal=" + getImporteTotal() +
            ", pagado='" + getPagado() + "'" +
            ", concepto='" + getConcepto() + "'" +
            "}";
    }
}
