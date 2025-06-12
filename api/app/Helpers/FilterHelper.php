<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;

class FilterHelper
{
    /**
     * Throw exception with message and param
     *
     * @param  string  $message  - Exception message
     * @param  array  $param  - Param to print
     *
     * @throws \Exception
     */
    private static function throwWithParam(string $message, array $param): void
    {
        throw new \Exception($message.': '.print_r($param, true));
    }

    /**
     * Validate closure param
     *
     * @param  array  $closureParam  - Closure param to validate
     *
     * @throws \Exception
     */
    private static function validateClosureParam(array $closureParam): void
    {
        if (! isset($closureParam['type'])) {
            FilterHelper::throwWithParam('Type key is required for closure param', $closureParam);
        }
        if ($closureParam['type'] !== 'closure') {
            FilterHelper::throwWithParam('Closure param must be of type closure', $closureParam);
        }
        if (! isset($closureParam['params'])) {
            FilterHelper::throwWithParam('Params are required for closure param', $closureParam);
        }
        foreach ($closureParam['params'] as $param) {
            if (! isset($param['type'])) {
                FilterHelper::throwWithParam('Type key is required for closure param', $param);
            }
            if ($param['type'] === 'method') {
                FilterHelper::validateMethodParam($param);
            } else {
                FilterHelper::throwWithParam('Invalid type for closure param', $param);
            }
        }
    }

    /**
     * Validate or fix value param
     *
     * @param  array  $valueParam  - Value param to validate
     *
     * @throws \Exception
     */
    private static function validateValueParam(array &$valueParam): void
    {
        if (! isset($valueParam['type'])) {
            FilterHelper::throwWithParam('Type key is required for value param', $valueParam);
        }
        if ($valueParam['type'] !== 'value') {
            FilterHelper::throwWithParam('Value param must be of type value', $valueParam);
        }
        if (! isset($valueParam['value'])) {
            // Don't throw here, we will set this to null when building method params
        }
    }

    /**
     * Validate method param
     *
     * @param  array  $methodParam  - Method param to validate
     *
     * @throws \Exception
     */
    private static function validateMethodParam(array $methodParam): void
    {
        if (! isset($methodParam['type'])) {
            FilterHelper::throwWithParam('Type key is required for method param', $methodParam);
        }
        if ($methodParam['type'] !== 'method') {
            FilterHelper::throwWithParam('Method param must be of type method', $methodParam);
        }
        if (! isset($methodParam['params'])) {
            FilterHelper::throwWithParam('Params are required for method param', $methodParam);
        }
        if (! isset($methodParam['method'])) {
            FilterHelper::throwWithParam('Method is required for method param', $methodParam);
        }
        if (! is_array($methodParam['params'])) {
            FilterHelper::throwWithParam('Params must be an array', $methodParam);
        }
        foreach ($methodParam['params'] as $param) {
            if (! isset($param['type'])) {
                FilterHelper::throwWithParam('Type key is required for method params', $param);
            }
            if ($param['type'] === 'value') {
                FilterHelper::validateValueParam($param);
            } elseif ($param['type'] === 'closure') {
                FilterHelper::validateClosureParam($param);
            } else {
                FilterHelper::throwWithParam('Invalid type for method param', $param);
            }
        }
    }

    /**
     * Validate filter spec
     *
     * @param  array  $filterSpec  - Filter spec to validate
     *
     * @throws \Exception
     */
    private static function validateFilterSpec(array $filterSpec): void
    {
        foreach ($filterSpec as $value) {
            FilterHelper::validateMethodParam($value);
        }
    }

    /**
     * Parses provided params into methods and method params
     *
     * @param  array  $params  - Params to build
     * @return array<Closure|string|number|null>
     */
    private static function buildParams(array $params): array
    {
        $output = [];
        foreach ($params as $param) {
            if ($param['type'] === 'value') {
                if (! isset($param['value'])) {
                    $param['value'] = null;
                } else {
                    $output[] = $param['value'];
                }
            } elseif ($param['type'] === 'closure') {
                $output[] = function ($query) use ($param) {
                    foreach ($param['params'] as $param) {
                        FilterHelper::applyMethod($query, $param);
                    }

                    return $query;
                };
            }
        }

        return $output;
    }

    /**
     * Apply method with params to query
     *
     * @param  Builder  $query  - Query to apply method to
     * @param  array  $methodParam  - Method param to apply
     *
     * @throws \Exception
     */
    private static function applyMethod(Builder &$query, array $methodParam): void
    {
        $methodName = $methodParam['method'];
        if (! is_callable([$query, $methodName])) {
            FilterHelper::throwWithParam('Invalid method name', $methodParam);
        }
        $params = $methodParam['params'];
        $query = $query->$methodName(...FilterHelper::buildParams($params));
    }

    /**
     * Apply filters to query
     *
     * @param  Builder  $query  - Query to apply filters to
     * @param  array  $filterSpecs  - Filter specs to apply
     *
     * @throws \Exception
     */
    public static function applyFilters(Builder &$query, $filterSpecs): void
    {
        foreach ($filterSpecs as $filterSpec) {
            FilterHelper::validateFilterSpec($filterSpec);
            $query = $query->where(function ($query) use ($filterSpec) {
                foreach ($filterSpec as $methodParam) {
                    FilterHelper::applyMethod($query, $methodParam);
                }

                return $query;
            });
        }
    }
}
