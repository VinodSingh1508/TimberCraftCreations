package com.javafreak.TimberCraft.Creations.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "coupons")
public class Coupon {

    @Id
    private String couponId;

    private Timestamp validFrom;

    private Timestamp validTill;

    @Column(nullable = false)
    private String flatPercent;

    private BigDecimal amount;

    private BigDecimal minCartValue;

    @Column(nullable = false, columnDefinition = "text default '*'")
    private String forUsers;

    // Getters and Setters

    public String getCouponId() {
        return couponId;
    }

    public void setCouponId(String couponId) {
        this.couponId = couponId;
    }

    public Timestamp getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(Timestamp validFrom) {
        this.validFrom = validFrom;
    }

    public Timestamp getValidTill() {
        return validTill;
    }

    public void setValidTill(Timestamp validTill) {
        this.validTill = validTill;
    }

    public String getFlatPercent() {
        return flatPercent;
    }

    public void setFlatPercent(String flatPercent) {
        if (!flatPercent.equals("Flat") && !flatPercent.equals("Percent")) {
            throw new IllegalArgumentException("flatPercent must be either 'Flat' or 'Percent'");
        }
        this.flatPercent = flatPercent;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getMinCartValue() {
        return minCartValue;
    }

    public void setMinCartValue(BigDecimal minCartValue) {
        this.minCartValue = minCartValue;
    }

    public String getForUsers() {
        return forUsers;
    }

    public void setForUsers(String forUsers) {
        this.forUsers = forUsers;
    }
}
