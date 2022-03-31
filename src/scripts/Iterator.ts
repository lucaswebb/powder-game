interface Iterator<T> {
    next(): T;
    hasNext(): boolean;
    reset(): void;
}