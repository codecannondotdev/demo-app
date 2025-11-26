<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if (Auth::guard('web')->user()->isAdmin()) {
            return [
                'name' => 'sometimes|required|string',
                'email' => 'sometimes|required|string',
                'role' => ['sometimes', 'required', 'string', Rule::in(['admin', 'user'])],
                'password' => 'sometimes|required|string',
            ];
        } else {
            return [
                'name' => 'sometimes|required|string',
                'email' => 'sometimes|required|string',
                'password' => 'sometimes|required|string',
            ];
        }
    }

    /**
     * Handle a failed validation attempt.
     *
     * @return void
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json(
                [
                    'message' => 'The given data was invalid.',
                    'errors' => $validator->errors(),
                ],
                422
            )
        );
    }
}
