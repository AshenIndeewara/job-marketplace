<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Every API response goes through a Resource so internal columns never leak
 * (JM-27). Money is always a string with two decimals plus a currency code —
 * never a float. Laravel paginators already emit current_page / per_page /
 * total at the top level, matching the PRS 5.3 meta shape.
 */
abstract class BaseResource extends JsonResource
{
    //
}
