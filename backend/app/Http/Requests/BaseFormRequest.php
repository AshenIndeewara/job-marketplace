<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Base class for every API form request (JM-27). Validation errors are
 * rendered by the exception handler as a 422 in the standard JSON shape.
 * Put cross-cutting validation rules here as they emerge.
 */
abstract class BaseFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // per-resource requests override this with a Policy check
    }
}
