import { RuntimeChecks } from '@ngrx/store';

export const RUNTIME_CHECKS: RuntimeChecks = {
    strictStateImmutability: true,
    strictActionImmutability: true,
    strictStateSerializability: true,
    strictActionSerializability: true,
};
