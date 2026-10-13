package com.thinkbuild.accounts.common;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public record Money(BigDecimal amount) implements Comparable<Money> {

    public Money {
        Objects.requireNonNull(amount, "Amount must not be null");
    }

    public static Money of(BigDecimal value, int scale) {
        if (value == null) {
            return new Money(BigDecimal.ZERO.setScale(scale, RoundingMode.HALF_UP));
        }
        return new Money(value.setScale(scale, RoundingMode.HALF_UP));
    }

    public static Money of(String value, int scale) {
        if (value == null || value.trim().isEmpty()) {
            return zero(scale);
        }
        return of(new BigDecimal(value.trim()), scale);
    }

    public static Money zero(int scale) {
        return new Money(BigDecimal.ZERO.setScale(scale, RoundingMode.HALF_UP));
    }

    public Money add(Money other) {
        Objects.requireNonNull(other, "Money operand must not be null");
        int targetScale = Math.max(this.amount.scale(), other.amount.scale());
        return new Money(this.amount.add(other.amount).setScale(targetScale, RoundingMode.HALF_UP));
    }

    public Money subtract(Money other) {
        Objects.requireNonNull(other, "Money operand must not be null");
        int targetScale = Math.max(this.amount.scale(), other.amount.scale());
        return new Money(this.amount.subtract(other.amount).setScale(targetScale, RoundingMode.HALF_UP));
    }

    public Money multiply(BigDecimal multiplicand) {
        Objects.requireNonNull(multiplicand, "Multiplicand must not be null");
        return new Money(this.amount.multiply(multiplicand).setScale(this.amount.scale(), RoundingMode.HALF_UP));
    }

    public Money multiply(long factor) {
        return multiply(BigDecimal.valueOf(factor));
    }

    public Money divide(BigDecimal divisor, RoundingMode roundingMode) {
        Objects.requireNonNull(divisor, "Divisor must not be null");
        return new Money(this.amount.divide(divisor, this.amount.scale(), roundingMode));
    }

    public Money divide(BigDecimal divisor) {
        return divide(divisor, RoundingMode.HALF_UP);
    }

    public boolean isPositive() {
        return this.amount.compareTo(BigDecimal.ZERO) > 0;
    }

    public boolean isNegative() {
        return this.amount.compareTo(BigDecimal.ZERO) < 0;
    }

    public boolean isZero() {
        return this.amount.compareTo(BigDecimal.ZERO) == 0;
    }

    @Override
    public int compareTo(Money other) {
        return this.amount.compareTo(other.amount);
    }

    @Override
    public String toString() {
        return amount.toPlainString();
    }
}
